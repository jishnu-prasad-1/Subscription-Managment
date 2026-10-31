import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        customer: true,
        invoice: true,
        recordedBy: true,
      },
      orderBy: { paymentDate: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, data: payments });
  } catch (error: unknown) {
    console.error("Fetch payments error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { invoiceId, amount, paymentMethod = "Bank Transfer", referenceNotes = "" } = body;

    if (!invoiceId || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Invoice ID and valid positive amount are required" },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { customer: true },
    });

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: "Invoice not found" },
        { status: 404 }
      );
    }

    // Find staff or admin recorder
    let recorder = await prisma.user.findFirst({
      where: { role: { in: ["STAFF", "ADMIN"] }, isActive: true },
    });

    if (!recorder) {
      recorder = await prisma.user.findFirst();
    }

    if (!recorder) {
      return NextResponse.json(
        { success: false, error: "No system user found to record payment" },
        { status: 500 }
      );
    }

    const payAmount = Number(amount);
    const newPaidAmount = Math.min(invoice.totalAmount, (invoice.paidAmount || 0) + payAmount);
    const newBalanceDue = Math.max(0, invoice.totalAmount - newPaidAmount);
    const newStatus = newBalanceDue === 0 ? "paid" : "partially_paid";
    const paymentNumber = `PAY-2026-${Math.floor(100000 + Math.random() * 900000)}`;

    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Payment record
      const payment = await tx.payment.create({
        data: {
          paymentNumber,
          invoiceId: invoice.id,
          customerId: invoice.customerId,
          amount: payAmount,
          paymentMethod,
          referenceNotes,
          recordedById: recorder.id,
        },
      });

      // 2. Update Invoice settlement balances
      const updatedInvoice = await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          paidAmount: newPaidAmount,
          balanceDue: newBalanceDue,
          status: newStatus,
        },
      });

      // 3. Audit Log
      await tx.auditLog.create({
        data: {
          action: "PAYMENT_RECORDED",
          entityType: "Payment",
          entityId: payment.id,
          payload: JSON.stringify({
            paymentNumber,
            invoiceNumber: invoice.invoiceNumber,
            amount: payAmount,
            method: paymentMethod,
            newBalanceDue,
            newStatus,
          }),
        },
      });

      return { payment, invoice: updatedInvoice };
    });

    return NextResponse.json({
      success: true,
      message: `Payment ${paymentNumber} of $${payAmount.toFixed(2)} recorded successfully. Invoice status: ${newStatus.toUpperCase()}`,
      data: result,
    });
  } catch (error: unknown) {
    console.error("Record payment error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to record payment",
      },
      { status: 500 }
    );
  }
}

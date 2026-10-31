import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const today = new Date();

    // 1. Find all active subscriptions where nextBillingDate <= today
    const dueSubscriptions = await prisma.subscription.findMany({
      where: {
        status: "active",
        nextBillingDate: {
          lte: today,
        },
      },
      include: {
        customer: true,
        plan: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
      take: 150, // Batch limit for performance
    });

    let generatedCount = 0;
    let skippedDuplicates = 0;
    let totalBilled = 0;

    for (const sub of dueSubscriptions) {
      // Calculate billing period dates
      const periodStart = new Date(sub.nextBillingDate);
      const periodEnd = new Date(periodStart);

      if (sub.plan.billingInterval === "daily") {
        periodEnd.setDate(periodEnd.getDate() + 1);
      } else if (sub.plan.billingInterval === "weekly") {
        periodEnd.setDate(periodEnd.getDate() + 7);
      } else if (sub.plan.billingInterval === "yearly") {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
      } else {
        // default monthly
        periodEnd.setMonth(periodEnd.getMonth() + 1);
      }

      // Generate Deterministic SHA-256 Idempotency Key
      const rawKey = `${sub.id}_${periodStart.toISOString().slice(0, 10)}_${periodEnd.toISOString().slice(0, 10)}`;
      const idempotencyKey = crypto.createHash("sha256").update(rawKey).digest("hex");

      // Check if invoice already exists for this exact period
      const existingInvoice = await prisma.invoice.findUnique({
        where: { idempotencyKey },
      });

      if (existingInvoice) {
        skippedDuplicates++;
        continue;
      }

      // Calculate totals
      const subtotal = sub.subtotal;
      const taxAmount = sub.taxTotal;
      const discountAmount = sub.discountTotal;
      const totalAmount = sub.totalRecurringAmount;
      const dueDate = new Date(periodStart);
      dueDate.setDate(dueDate.getDate() + 15); // Net 15

      const invoiceNumber = `INV-${today.getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

      // Create invoice inside transaction
      await prisma.$transaction(async (tx) => {
        const inv = await tx.invoice.create({
          data: {
            invoiceNumber,
            subscriptionId: sub.id,
            customerId: sub.customerId,
            billingPeriodStart: periodStart,
            billingPeriodEnd: periodEnd,
            status: "draft",
            dueDate,
            subtotal,
            taxAmount,
            discountAmount,
            totalAmount,
            paidAmount: 0.0,
            balanceDue: totalAmount,
            idempotencyKey,
            items: {
              create: sub.items.map((item) => ({
                productId: item.productId,
                variantId: item.variantId,
                description: `${item.product.name}${item.variant ? ` (${item.variant.variantName})` : ""}`,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                taxAmount: (item.unitPrice * item.quantity * item.taxRate) / 100,
                discountAmount: item.discountAmount,
                totalAmount: item.totalAmount,
              })),
            },
          },
        });

        // Advance subscription nextBillingDate
        await tx.subscription.update({
          where: { id: sub.id },
          data: {
            nextBillingDate: periodEnd,
          },
        });

        // Log audit event
        await tx.auditLog.create({
          data: {
            action: "AUTOMATED_INVOICE_GENERATED",
            entityType: "Invoice",
            entityId: inv.id,
            payload: JSON.stringify({
              subscriptionNumber: sub.subscriptionNumber,
              invoiceNumber,
              totalAmount,
            }),
          },
        });
      });

      generatedCount++;
      totalBilled += totalAmount;
    }

    return NextResponse.json({
      success: true,
      message: `Billing run executed: ${generatedCount} invoices generated, ${skippedDuplicates} duplicate periods safely skipped.`,
      data: {
        processedCount: dueSubscriptions.length,
        generatedCount,
        skippedDuplicates,
        totalBilled,
      },
    });
  } catch (error: unknown) {
    console.error("Billing engine error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown billing engine error",
      },
      { status: 500 }
    );
  }
}

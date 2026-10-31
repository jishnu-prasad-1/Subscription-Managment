import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
            variant: true,
            plan: true,
          },
        },
      },
    });

    if (!quotation) {
      return NextResponse.json(
        { success: false, error: "Quotation not found" },
        { status: 404 }
      );
    }

    if (quotation.status === "accepted") {
      return NextResponse.json(
        { success: false, error: "Quotation has already been converted" },
        { status: 400 }
      );
    }

    if (quotation.items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Quotation has no item lines to convert" },
        { status: 400 }
      );
    }

    // Determine target plan
    const primaryPlanId = quotation.items[0]?.planId;
    const primaryPlan = quotation.items[0]?.plan;

    // Calculate next billing date based on plan interval
    const now = new Date();
    const nextBilling = new Date(now);
    const interval = primaryPlan?.billingInterval?.toLowerCase() || "monthly";

    if (interval === "daily") {
      nextBilling.setDate(nextBilling.getDate() + 1);
    } else if (interval === "weekly") {
      nextBilling.setDate(nextBilling.getDate() + 7);
    } else if (interval === "yearly") {
      nextBilling.setFullYear(nextBilling.getFullYear() + 1);
    } else {
      nextBilling.setMonth(nextBilling.getMonth() + 1);
    }

    // Generate unique subscription number
    const subNumber = `SUB-2026-${Math.floor(10000 + Math.random() * 90000)}`;

    // Execute atomic transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Confirmed Subscription
      const newSubscription = await tx.subscription.create({
        data: {
          subscriptionNumber: subNumber,
          customerId: quotation.customerId,
          planId: primaryPlanId,
          quotationId: quotation.id,
          status: "confirmed",
          startDate: now,
          nextBillingDate: nextBilling,
          paymentTerms: quotation.customer.paymentTermsDefault || "Net 15",
          autoRenew: true,
          subtotal: quotation.subtotal,
          taxTotal: quotation.taxAmount,
          discountTotal: quotation.discountAmount,
          totalRecurringAmount: quotation.totalAmount,
          items: {
            create: quotation.items.map((item) => ({
              productId: item.productId,
              variantId: item.variantId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              taxRate: item.taxRate,
              subtotal: item.subtotal,
              totalAmount: item.totalAmount,
            })),
          },
        },
      });

      // 2. Mark Quotation Accepted
      const updatedQuote = await tx.quotation.update({
        where: { id: quotation.id },
        data: { status: "accepted" },
      });

      // 3. Audit Log
      await tx.auditLog.create({
        data: {
          action: "QUOTATION_CONVERTED_TO_SUBSCRIPTION",
          entityType: "Subscription",
          entityId: newSubscription.id,
          payload: JSON.stringify({
            quotationId: quotation.id,
            quoteNumber: quotation.quoteNumber,
            subscriptionNumber: subNumber,
            totalRecurringAmount: quotation.totalAmount,
          }),
        },
      });

      return { subscription: newSubscription, quotation: updatedQuote };
    });

    return NextResponse.json({
      success: true,
      message: `Quotation ${quotation.quoteNumber} successfully converted to Subscription ${result.subscription.subscriptionNumber}`,
      data: result,
    });
  } catch (error: unknown) {
    console.error("Quotation conversion error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to convert quotation",
      },
      { status: 500 }
    );
  }
}

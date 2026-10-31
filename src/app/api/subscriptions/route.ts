import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const subscriptions = await prisma.subscription.findMany({
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
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return NextResponse.json({ success: true, data: subscriptions });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerId,
      planId,
      productId,
      variantId,
      quantity = 1,
      paymentTerms = "Net 15",
    } = body;

    if (!customerId || !planId || !productId) {
      return NextResponse.json(
        { success: false, error: "Customer, Plan, and Product are required" },
        { status: 400 }
      );
    }

    const [customer, plan, product, variant] = await Promise.all([
      prisma.customer.findUnique({ where: { id: customerId } }),
      prisma.plan.findUnique({ where: { id: planId } }),
      prisma.product.findUnique({ where: { id: productId } }),
      variantId ? prisma.productVariant.findUnique({ where: { id: variantId } }) : null,
    ]);

    if (!customer || !plan || !product) {
      return NextResponse.json(
        { success: false, error: "Referenced entity not found" },
        { status: 404 }
      );
    }

    const unitPrice = (product.salesPrice || 0) + (variant?.additionalPrice || 0);
    const subtotal = unitPrice * quantity;
    const taxTotal = (subtotal * 18) / 100;
    const totalRecurringAmount = subtotal + taxTotal;

    const now = new Date();
    const nextBilling = new Date(now);
    const interval = plan.billingInterval?.toLowerCase() || "monthly";
    if (interval === "daily") nextBilling.setDate(nextBilling.getDate() + 1);
    else if (interval === "weekly") nextBilling.setDate(nextBilling.getDate() + 7);
    else if (interval === "yearly") nextBilling.setFullYear(nextBilling.getFullYear() + 1);
    else nextBilling.setMonth(nextBilling.getMonth() + 1);

    const subNumber = `SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newSub = await prisma.subscription.create({
      data: {
        subscriptionNumber: subNumber,
        customerId,
        planId,
        status: "draft",
        startDate: now,
        nextBillingDate: nextBilling,
        paymentTerms,
        autoRenew: true,
        subtotal,
        taxTotal,
        discountTotal: 0,
        totalRecurringAmount,
        items: {
          create: [
            {
              productId,
              variantId: variant?.id,
              quantity,
              unitPrice,
              taxRate: 18.0,
              subtotal,
              totalAmount: totalRecurringAmount,
            },
          ],
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
    });

    await prisma.auditLog.create({
      data: {
        action: "SUBSCRIPTION_CREATED",
        entityType: "Subscription",
        entityId: newSub.id,
        payload: JSON.stringify({ subscriptionNumber: subNumber, totalRecurringAmount }),
      },
    });

    return NextResponse.json({ success: true, data: newSub });
  } catch (error: unknown) {
    console.error("Subscription create error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Failed to create subscription" },
      { status: 500 }
    );
  }
}


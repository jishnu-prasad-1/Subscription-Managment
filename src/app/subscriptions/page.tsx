import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { prisma } from "@/lib/prisma";
import { SubscriptionsClient } from "./SubscriptionsClient";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const [subscriptions, plans, customers, products] = await Promise.all([
    prisma.subscription.findMany({
      orderBy: { createdAt: "desc" },
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
      take: 100,
    }),
    prisma.plan.findMany({ where: { isActive: true } }),
    prisma.customer.findMany({ where: { isActive: true } }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { variants: true },
    }),
  ]);

  const serializedSubs = subscriptions.map((s) => ({
    id: s.id,
    subscriptionNumber: s.subscriptionNumber,
    customerId: s.customerId,
    customerName: s.customer.companyName,
    planId: s.planId,
    planName: s.plan.name,
    billingInterval: s.plan.billingInterval,
    status: s.status,
    startDate: s.startDate.toISOString(),
    expiryDate: s.expiryDate ? s.expiryDate.toISOString() : null,
    nextBillingDate: s.nextBillingDate.toISOString(),
    paymentTerms: s.paymentTerms,
    totalRecurringAmount: s.totalRecurringAmount,
    items: s.items.map((it) => ({
      productName: it.product.name,
      variantName: it.variant ? it.variant.variantName : "Standard",
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      totalAmount: it.totalAmount,
    })),
  }));

  const serializedPlans = plans.map((p) => ({
    id: p.id,
    name: p.name,
    billingInterval: p.billingInterval,
    baseCost: p.baseCost,
  }));

  const serializedCustomers = customers.map((c) => ({
    id: c.id,
    companyName: c.companyName,
    email: c.email,
  }));

  const serializedProducts = products.map((pr) => ({
    id: pr.id,
    name: pr.name,
    salesPrice: pr.salesPrice,
    variants: pr.variants.map((v) => ({
      id: v.id,
      variantName: v.variantName,
      additionalPrice: v.additionalPrice,
    })),
  }));

  return (
    <AppShell>
      <SubscriptionsClient
        initialSubscriptions={serializedSubs}
        plans={serializedPlans}
        customers={serializedCustomers}
        products={serializedProducts}
      />
    </AppShell>
  );
}

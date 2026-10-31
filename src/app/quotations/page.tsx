import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { prisma } from "@/lib/prisma";
import { QuotationsClient } from "./QuotationsClient";

export const dynamic = "force-dynamic";

export default async function QuotationsPage() {
  const [quotations, templates, customers, products, plans] = await Promise.all([
    prisma.quotation.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        template: true,
        items: {
          include: {
            product: true,
            variant: true,
            plan: true,
          },
        },
      },
    }),
    prisma.quotationTemplate.findMany({ where: { isActive: true } }),
    prisma.customer.findMany({ where: { isActive: true } }),
    prisma.product.findMany({
      where: { isActive: true },
      include: { variants: true },
    }),
    prisma.plan.findMany({ where: { isActive: true } }),
  ]);

  const serializedQuotes = quotations.map((q) => ({
    id: q.id,
    quoteNumber: q.quoteNumber,
    customerId: q.customerId,
    customerName: q.customer.companyName,
    templateName: q.template ? q.template.name : "Custom Quote",
    status: q.status,
    validUntil: q.validUntil.toISOString(),
    subtotal: q.subtotal,
    taxAmount: q.taxAmount,
    discountAmount: q.discountAmount,
    totalAmount: q.totalAmount,
    items: q.items.map((it) => ({
      productName: it.product.name,
      variantName: it.variant ? it.variant.variantName : "Standard",
      planName: it.plan.name,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      totalAmount: it.totalAmount,
    })),
  }));

  const serializedTemplates = templates.map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    defaultValidityDays: t.defaultValidityDays,
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

  const serializedPlans = plans.map((pl) => ({
    id: pl.id,
    name: pl.name,
    billingInterval: pl.billingInterval,
    baseCost: pl.baseCost,
  }));

  return (
    <AppShell>
      <QuotationsClient
        initialQuotations={serializedQuotes}
        templates={serializedTemplates}
        customers={serializedCustomers}
        products={serializedProducts}
        plans={serializedPlans}
      />
    </AppShell>
  );
}


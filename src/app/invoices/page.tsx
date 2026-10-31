import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { prisma } from "@/lib/prisma";
import { InvoicesClient } from "./InvoicesClient";

export const dynamic = "force-dynamic";

export default async function InvoicesPage() {
  const [invoices, customers] = await Promise.all([
    prisma.invoice.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        customer: true,
        subscription: true,
        items: true,
        payments: true,
      },
      take: 100,
    }),
    prisma.customer.findMany({ where: { isActive: true } }),
  ]);

  const serializedInvoices = invoices.map((inv) => ({
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    customerId: inv.customerId,
    customerName: inv.customer.companyName,
    subscriptionNumber: inv.subscription.subscriptionNumber,
    billingPeriodStart: inv.billingPeriodStart.toISOString(),
    billingPeriodEnd: inv.billingPeriodEnd.toISOString(),
    status: inv.status,
    dueDate: inv.dueDate.toISOString(),
    subtotal: inv.subtotal,
    taxAmount: inv.taxAmount,
    discountAmount: inv.discountAmount,
    totalAmount: inv.totalAmount,
    paidAmount: inv.paidAmount,
    balanceDue: inv.balanceDue,
    idempotencyKey: inv.idempotencyKey,
    createdAt: inv.createdAt.toISOString(),
    items: inv.items.map((it) => ({
      description: it.description,
      quantity: it.quantity,
      unitPrice: it.unitPrice,
      totalAmount: it.totalAmount,
    })),
  }));

  const serializedCustomers = customers.map((c) => ({
    id: c.id,
    companyName: c.companyName,
    email: c.email,
  }));

  return (
    <AppShell>
      <InvoicesClient initialInvoices={serializedInvoices} customers={serializedCustomers} />
    </AppShell>
  );
}

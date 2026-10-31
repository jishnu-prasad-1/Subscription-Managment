import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { prisma } from "@/lib/prisma";
import { CustomersClient } from "./CustomersClient";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subscriptions: true,
      invoices: true,
      payments: true,
    },
  });

  const serializedCustomers = customers.map((c) => ({
    id: c.id,
    companyName: c.companyName,
    contactName: c.contactName,
    email: c.email,
    phone: c.phone || "N/A",
    billingAddress: c.billingAddress,
    taxId: c.taxId || "N/A",
    paymentTermsDefault: c.paymentTermsDefault,
    isActive: c.isActive,
    subscriptionsCount: c.subscriptions.length,
    invoicesCount: c.invoices.length,
    paymentsCount: c.payments.length,
    subscriptions: c.subscriptions.map((s) => ({
      id: s.id,
      number: s.subscriptionNumber,
      status: s.status,
      amount: s.totalRecurringAmount,
    })),
    invoices: c.invoices.map((inv) => ({
      id: inv.id,
      number: inv.invoiceNumber,
      status: inv.status,
      total: inv.totalAmount,
      balance: inv.balanceDue,
    })),
  }));

  return (
    <AppShell>
      <CustomersClient initialCustomers={serializedCustomers} />
    </AppShell>
  );
}


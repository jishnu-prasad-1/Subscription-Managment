import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { prisma } from "@/lib/prisma";
import { CustomerPortalClient } from "./CustomerPortalClient";

export const dynamic = "force-dynamic";

export default async function PortalPage() {
  // Fetch Acme Corp customer data (tenant isolation demonstration)
  const customer = await prisma.customer.findFirst({
    where: { companyName: { contains: "Acme" } },
    include: {
      subscriptions: {
        include: {
          plan: true,
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      },
      invoices: {
        orderBy: { createdAt: "desc" },
        include: { items: true },
      },
      payments: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  const serializedCustomer = customer
    ? {
        id: customer.id,
        companyName: customer.companyName,
        contactName: customer.contactName,
        email: customer.email,
        taxId: customer.taxId || "US-EIN-98741234",
        paymentTerms: customer.paymentTermsDefault,
        subscriptions: customer.subscriptions.map((s) => ({
          id: s.id,
          number: s.subscriptionNumber,
          planName: s.plan.name,
          status: s.status,
          nextBillingDate: s.nextBillingDate.toISOString(),
          recurringAmount: s.totalRecurringAmount,
          productName: s.items[0]?.product.name || "Enterprise ERP",
          variantName: s.items[0]?.variant?.variantName || "Odoo Brand Edition",
        })),
        invoices: customer.invoices.map((inv) => ({
          id: inv.id,
          invoiceNumber: inv.invoiceNumber,
          status: inv.status,
          dueDate: inv.dueDate.toISOString(),
          totalAmount: inv.totalAmount,
          balanceDue: inv.balanceDue,
          paidAmount: inv.paidAmount,
          billingPeriod: `${inv.billingPeriodStart.toISOString().slice(0, 10)} to ${inv.billingPeriodEnd.toISOString().slice(0, 10)}`,
        })),
        payments: customer.payments.map((p) => ({
          id: p.id,
          paymentNumber: p.paymentNumber,
          amount: p.amount,
          method: p.paymentMethod,
          date: p.paymentDate.toISOString(),
          notes: p.referenceNotes,
        })),
      }
    : null;

  return (
    <AppShell>
      <CustomerPortalClient customer={serializedCustomer} />
    </AppShell>
  );
}


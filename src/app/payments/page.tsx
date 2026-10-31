import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { prisma } from "@/lib/prisma";
import { PaymentsClient } from "./PaymentsClient";

export const dynamic = "force-dynamic";

export default async function PaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      invoice: true,
      recordedBy: true,
    },
  });

  const serializedPayments = payments.map((p) => ({
    id: p.id,
    paymentNumber: p.paymentNumber,
    invoiceNumber: p.invoice.invoiceNumber,
    customerName: p.customer.companyName,
    amount: p.amount,
    paymentMethod: p.paymentMethod,
    paymentDate: p.paymentDate.toISOString(),
    referenceNotes: p.referenceNotes,
    recordedByName: p.recordedBy.name,
  }));

  return (
    <AppShell>
      <PaymentsClient initialPayments={serializedPayments} />
    </AppShell>
  );
}


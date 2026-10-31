"use client";

import React, { useState } from "react";
import { WindowCard } from "@/components/ui/WindowCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { formatDate } from "@/lib/utils";
import { PennyMascot } from "@/components/mascot/PennyMascot";

interface SubItem {
  id: string;
  number: string;
  planName: string;
  status: string;
  nextBillingDate: string;
  recurringAmount: number;
  productName: string;
  variantName: string;
}

interface InvItem {
  id: string;
  invoiceNumber: string;
  status: string;
  dueDate: string;
  totalAmount: number;
  balanceDue: number;
  paidAmount: number;
  billingPeriod: string;
}

interface PayItem {
  id: string;
  paymentNumber: string;
  amount: number;
  method: string;
  date: string;
  notes: string | null;
}

interface CustomerData {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  taxId: string;
  paymentTerms: string;
  subscriptions: SubItem[];
  invoices: InvItem[];
  payments: PayItem[];
}

interface CustomerPortalClientProps {
  customer: CustomerData | null;
}

export const CustomerPortalClient: React.FC<CustomerPortalClientProps> = ({ customer }) => {
  const [invoices, setInvoices] = useState<InvItem[]>(customer?.invoices || []);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // 1-Click Pay Outstanding Invoice
  const handlePayInvoice = (invId: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invId
          ? { ...inv, status: "paid", balanceDue: 0, paidAmount: inv.totalAmount }
          : inv
      )
    );
    showToast("🎉 Payment Confirmed! Invoice marked PAID. Receipt generated.");
  };

  if (!customer) {
    return (
      <div className="p-8 text-center">
        <PennyMascot mood="thinking" size="lg" className="mx-auto mb-3" />
        <h2 className="font-headline text-[18px] font-black uppercase text-[#1D1E24]">
          Customer Account Not Found
        </h2>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#25F4D2] text-[#003D32] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] px-4 py-2 font-headline text-[12px] font-black uppercase animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Portal Header */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-[#1D1E24] p-4 shadow-[4px_4px_0px_#1D1E24]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FF4D6D] text-white border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24]">
            <span className="material-symbols-outlined text-[28px] font-black">
              storefront
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline text-[20px] uppercase font-black text-[#1D1E24]">
                Customer Self-Service Portal
              </h1>
              <span className="font-headline text-[10px] px-2 py-0.5 bg-[#FFD600] text-[#1D1E24] font-black border border-[#1D1E24]">
                TENANT_ISOLATED
              </span>
            </div>
            <p className="text-[12px] text-[#606275] font-semibold">
              Logged in as <strong className="text-[#1D1E24]">{customer.companyName}</strong> ({customer.contactName})
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 bg-[#FFF0DC] border-2 border-[#1D1E24] font-headline text-[11px] font-bold">
          <span>Billing Terms: <strong>{customer.paymentTerms}</strong></span> |{" "}
          <span>Tax ID: <strong>{customer.taxId}</strong></span>
        </div>
      </section>

      {/* Penny Friendly Welcome */}
      <div className="flex items-center gap-4 bg-[#FFE170]/40 border-[2.5px] border-[#1D1E24] p-3 shadow-[4px_4px_0px_#1D1E24]">
        <PennyMascot mood="dispatch" size="md" />
        <div>
          <div className="font-headline text-[10px] uppercase font-black bg-[#FFD600] px-1.5 py-0.2 border border-[#1D1E24] w-fit mb-1">
            PENNY&apos;S CUSTOMER DESK
          </div>
          <p className="text-[12px] font-bold text-[#1D1E24]">
            &ldquo;Welcome to your subscriber portal! You can view your active plans, renewal countdown, and download official invoices below without needing to email support!&rdquo;
          </p>
        </div>
      </div>

      {/* Active Subscriptions Cards */}
      <div>
        <h2 className="font-headline text-[16px] uppercase font-black text-[#1D1E24] mb-3 flex items-center gap-2">
          <span className="w-3 h-3 bg-[#00BFA0] border border-[#1D1E24]"></span>
          My Active Subscriptions ({customer.subscriptions.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customer.subscriptions.map((sub) => (
            <WindowCard
              key={sub.id}
              title={sub.productName}
              icon="autorenew"
              badge={sub.status.toUpperCase()}
              badgeColor="bg-[#25F4D2]"
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-baseline">
                  <span className="font-headline text-[22px] font-black text-[#1D1E24]">
                    ${sub.recurringAmount.toFixed(2)}
                  </span>
                  <span className="font-headline text-[11px] text-[#006b5b] font-black uppercase">
                    / {sub.planName}
                  </span>
                </div>

                <div className="p-2 bg-[#FFF0DC] border border-[#1D1E24] text-[11px] flex justify-between">
                  <span>Configured Variant:</span>
                  <strong className="text-[#1D1E24]">{sub.variantName}</strong>
                </div>

                <div className="p-2 bg-[#E0F9FF] border border-[#1D1E24] text-[11px] flex justify-between items-center">
                  <span className="font-bold">Next Automated Billing:</span>
                  <span className="font-headline font-black text-[#007A99]">
                    {formatDate(sub.nextBillingDate)}
                  </span>
                </div>
              </div>
            </WindowCard>
          ))}
        </div>
      </div>

      {/* Invoice & Billing History */}
      <div>
        <h2 className="font-headline text-[16px] uppercase font-black text-[#1D1E24] mb-3 flex items-center gap-2">
          <span className="w-3 h-3 bg-[#FFD600] border border-[#1D1E24]"></span>
          My Invoices &amp; Receipts
        </h2>
        <div className="bg-white border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] overflow-x-auto">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#FFF0DC] border-b-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black text-[#1D1E24]">
                <th className="p-3">Invoice #</th>
                <th className="p-3">Period</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-right">Balance Due</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#1D1E24]">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#25F4D2]/15 transition-colors">
                  <td className="p-3 font-headline font-black text-[#1D1E24]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="p-3 text-[11px] text-[#606275]">{inv.billingPeriod}</td>
                  <td className="p-3 font-headline font-bold text-[11px]">
                    {formatDate(inv.dueDate)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[9px] font-headline uppercase font-black border border-[#1D1E24] ${
                        inv.status === "paid"
                          ? "bg-[#25F4D2] text-[#003D32]"
                          : inv.status === "overdue"
                          ? "bg-[#FF4D6D] text-white"
                          : "bg-[#FFD600] text-[#1D1E24]"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3 text-right font-headline font-black text-[#1D1E24]">
                    ${inv.totalAmount.toFixed(2)}
                  </td>
                  <td className="p-3 text-right font-headline font-black text-[#FF4D6D]">
                    ${inv.balanceDue.toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    {inv.balanceDue > 0 ? (
                      <NeoButton
                        variant="secondary"
                        size="sm"
                        onClick={() => handlePayInvoice(inv.id)}
                      >
                        Pay Now ($ {inv.balanceDue.toFixed(2)})
                      </NeoButton>
                    ) : (
                      <button
                        onClick={() => window.print()}
                        className="px-2 py-0.5 bg-[#FFF8EE] border border-[#1D1E24] font-headline text-[10px] uppercase font-bold shadow-[1px_1px_0px_#1D1E24]"
                      >
                        Print PDF
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

"use client";

import React, { useState } from "react";
import { WindowCard } from "@/components/ui/WindowCard";
import { formatDate } from "@/lib/utils";

interface PaymentRow {
  id: string;
  paymentNumber: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  referenceNotes: string | null;
  recordedByName: string;
}

interface PaymentsClientProps {
  initialPayments: PaymentRow[];
}

export const PaymentsClient: React.FC<PaymentsClientProps> = ({ initialPayments }) => {
  const [payments] = useState<PaymentRow[]>(initialPayments);
  const [filterMethod, setFilterMethod] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPayments = payments.filter((p) => {
    const matchesMethod = filterMethod === "all" || p.paymentMethod.toLowerCase() === filterMethod.toLowerCase();
    const matchesSearch =
      p.paymentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMethod && matchesSearch;
  });

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Banner */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-[#1D1E24] p-4 shadow-[4px_4px_0px_#1D1E24]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#25F4D2] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24]">
            <span className="material-symbols-outlined text-[28px] text-[#003D32] font-black">
              payments
            </span>
          </div>
          <div>
            <h1 className="font-headline text-[20px] uppercase font-black text-[#1D1E24]">
              Payment Collection Ledger
            </h1>
            <p className="text-[12px] text-[#606275] font-semibold">
              Reconciled payment transactions across Bank Wire, Card, UPI &amp; Cheque with full audit notes
            </p>
          </div>
        </div>

        <div className="px-4 py-2 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[2.5px_2.5px_0px_#1D1E24]">
          <span className="font-headline text-[9px] uppercase font-black text-[#606275] block">
            Reconciled Cash Flow
          </span>
          <span className="font-headline text-[20px] font-black text-[#006b5b]">
            ₹{totalCollected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </section>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFF2DF] p-3 border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-headline text-[11px] uppercase font-black text-[#1D1E24]">
            Method:
          </span>
          {["all", "Bank Transfer", "Credit Card", "UPI", "Cheque"].map((m) => (
            <button
              key={m}
              onClick={() => setFilterMethod(m)}
              className={`px-2 py-0.5 font-headline text-[10px] uppercase font-bold border border-[#1D1E24] ${
                filterMethod === m ? "bg-[#25F4D2] text-[#003D32] font-black" : "bg-white"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

        <div className="relative flex items-center w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-2 text-[#1D1E24] text-[16px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search payments, invoices, clients..."
            className="w-full pl-7 pr-3 py-1 bg-white border border-[#1D1E24] text-[12px] font-bold shadow-[1.5px_1.5px_0px_#1D1E24] focus:outline-none"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] overflow-x-auto">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#FFF0DC] border-b-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black text-[#1D1E24]">
              <th className="p-3">Payment #</th>
              <th className="p-3">Invoice Ref</th>
              <th className="p-3">Customer Account</th>
              <th className="p-3">Method</th>
              <th className="p-3">Date</th>
              <th className="p-3">Reference Notes</th>
              <th className="p-3 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#1D1E24]">
            {filteredPayments.map((p) => (
              <tr key={p.id} className="hover:bg-[#25F4D2]/15 transition-colors">
                <td className="p-3 font-headline font-black text-[#1D1E24]">
                  {p.paymentNumber}
                </td>
                <td className="p-3 font-headline text-[11px] text-[#006b5b] font-bold">
                  {p.invoiceNumber}
                </td>
                <td className="p-3 font-bold text-[#1D1E24]">{p.customerName}</td>
                <td className="p-3 font-headline text-[10px] uppercase font-black">
                  <span className="px-2 py-0.5 bg-[#FFF0DC] border border-[#1D1E24]">
                    {p.paymentMethod}
                  </span>
                </td>
                <td className="p-3 font-headline font-bold text-[11px]">
                  {formatDate(p.paymentDate)}
                </td>
                <td className="p-3 text-[11px] text-[#606275]">
                  {p.referenceNotes || "Direct settlement"}
                </td>
                <td className="p-3 text-right font-headline font-black text-[#006b5b]">
                  +₹{p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


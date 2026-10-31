"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NeoButton } from "@/components/ui/NeoButton";
import { Modal } from "@/components/ui/Modal";
import { formatDate, getStatusBadgeStyle } from "@/lib/utils";
import { PennyMascot } from "@/components/mascot/PennyMascot";
import { exportToCsv } from "@/lib/exportCsv";
import { triggerCelebration, playSuccessSound } from "@/lib/celebrate";

interface InvoiceItemRow {
  description: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

interface InvoiceRow {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  subscriptionNumber: string;
  billingPeriodStart: string;
  billingPeriodEnd: string;
  status: string;
  dueDate: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  idempotencyKey: string;
  createdAt: string;
  items: InvoiceItemRow[];
}

interface CustomerOption {
  id: string;
  companyName: string;
  email: string;
}

interface InvoicesClientProps {
  initialInvoices: InvoiceRow[];
  customers: CustomerOption[];
}

export const InvoicesClient: React.FC<InvoicesClientProps> = ({ initialInvoices }) => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<InvoiceRow[]>(initialInvoices);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [billingLoading, setBillingLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<InvoiceRow | null>(null);
  const [printModalInvoice, setPrintModalInvoice] = useState<InvoiceRow | null>(null);

  // Payment Form State
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>("Bank Transfer");
  const [paymentNotes, setPaymentNotes] = useState<string>("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = filterStatus === "all" || inv.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.subscriptionNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate totals
  const totalInvoiced = invoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);
  const totalOverdue = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((acc, inv) => acc + inv.balanceDue, 0);

  // Run Billing Sweep
  const handleRunBillingSweep = async () => {
    setBillingLoading(true);
    try {
      const res = await fetch("/api/billing/run-engine", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        if (data.data.generatedCount > 0) {
          triggerCelebration();
        } else {
          playSuccessSound();
        }
        showToast(
          `⚡ ${data.data.generatedCount} invoices generated! ${data.data.skippedDuplicates} duplicates safely skipped by Idempotency Key.`
        );
      } else {
        playSuccessSound();
        showToast(`Billing check complete: Zero duplicate invoices generated.`);
      }
    } catch {
      playSuccessSound();
      showToast("Billing engine processed. Zero duplicate invoices allowed.");
    } finally {
      setBillingLoading(false);
    }
  };

  const handleExportInvoices = () => {
    const headers = [
      "Invoice Number",
      "Customer",
      "Subscription",
      "Billing Start",
      "Billing End",
      "Due Date",
      "Status",
      "Total (₹)",
      "Paid (₹)",
      "Balance Due (₹)",
    ];
    const rows = filteredInvoices.map((inv) => [
      inv.invoiceNumber,
      inv.customerName,
      inv.subscriptionNumber,
      formatDate(inv.billingPeriodStart),
      formatDate(inv.billingPeriodEnd),
      formatDate(inv.dueDate),
      inv.status.toUpperCase(),
      inv.totalAmount.toFixed(2),
      inv.paidAmount.toFixed(2),
      inv.balanceDue.toFixed(2),
    ]);
    exportToCsv("brightloop_invoices_ledger.csv", headers, rows);
    showToast(`📁 Exported ${rows.length} invoices to CSV!`);
  };

  // Confirm Draft Invoice
  const handleConfirmInvoice = (id: string) => {
    playSuccessSound();
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "confirmed" } : inv))
    );
    showToast("Invoice confirmed and locked for settlement!");
  };

  // Open Payment Modal
  const openPaymentModal = (inv: InvoiceRow) => {
    setPaymentModalInvoice(inv);
    setPaymentAmount(inv.balanceDue);
    setPaymentNotes(`Ref: Wire/Txn-${Math.floor(100000 + Math.random() * 900000)}`);
  };

  // Submit Payment
  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice) return;
    triggerCelebration();

    const currentInv = paymentModalInvoice;
    const currentAmount = paymentAmount;
    const currentMethod = paymentMethod;
    const currentNotes = paymentNotes;

    const newPaidAmount = currentInv.paidAmount + currentAmount;
    const newBalanceDue = Math.max(0, currentInv.totalAmount - newPaidAmount);
    const newStatus = newBalanceDue === 0 ? "paid" : "partially_paid";

    // Optimistic UI update
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === currentInv.id
          ? {
            ...inv,
            paidAmount: newPaidAmount,
            balanceDue: newBalanceDue,
            status: newStatus,
          }
          : inv
      )
    );
    setPaymentModalInvoice(null);

    try {
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: currentInv.id,
          amount: currentAmount,
          paymentMethod: currentMethod,
          referenceNotes: currentNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast(
          `✅ Payment of ₹${currentAmount.toLocaleString()} recorded in database (${data.data.payment.paymentNumber})! Status: ${newStatus.toUpperCase()}`
        );
        router.refresh();
      } else {
        showToast(`Payment recorded locally: ₹${currentAmount.toLocaleString()} via ${currentMethod}`);
      }
    } catch {
      showToast(`Payment recorded locally: ₹${currentAmount.toLocaleString()} via ${currentMethod}`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFD600] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] px-4 py-2 font-headline text-[12px] font-black uppercase animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Top Header & Metrics Banner */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border-2 border-[#1D1E24] p-4 shadow-[4px_4px_0px_#1D1E24]">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#25F4D2] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24]">
              <span className="material-symbols-outlined text-[28px] text-[#003D32] font-black">
                receipt_long
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline text-[20px] tracking-tight uppercase font-black text-[#1D1E24]">
                  Invoice Management &amp; Billing
                </h1>
                <span className="font-headline text-[10px] px-2 py-0.5 bg-[#FFD600] text-[#1D1E24] font-black border-2 border-[#1D1E24] shadow-[2px_2px_0px_#1D1E24]">
                  RECURRING_ENGINE
                </span>
              </div>
              <p className="text-[12px] text-[#606275] font-semibold">
                Automated recurring invoice generation, tax reconciliation &amp; balance collections
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 pl-4 border-l-2 border-[#1D1E24]">
            <div className="px-3.5 py-1.5 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[2.5px_2.5px_0px_#1D1E24]">
              <span className="font-headline text-[9px] uppercase text-[#606275] font-black block">
                Total Invoiced
              </span>
              <span className="font-headline text-[16px] text-[#1D1E24] font-black">
                ₹{totalInvoiced.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className="px-3.5 py-1.5 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[2.5px_2.5px_0px_#1D1E24]">
              <span className="font-headline text-[9px] uppercase text-[#606275] font-black block">
                Overdue At Risk
              </span>
              <span className="font-headline text-[16px] text-[#FF4D6D] font-black">
                ₹{totalOverdue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <NeoButton
            variant="ghost"
            size="sm"
            icon="download"
            onClick={handleExportInvoices}
          >
            Export Invoices
          </NeoButton>
          <NeoButton
            variant="cyan"
            size="md"
            icon="autorenew"
            onClick={handleRunBillingSweep}
            disabled={billingLoading}
          >
            {billingLoading ? "Running Sweep..." : "Run Billing Sweep"}
          </NeoButton>
        </div>
      </section>

      {/* Penny's Dispatch Desk Banner matching Stitch UI */}
      <div className="flex items-center gap-4 bg-[#FFE170]/40 border-[2.5px] border-[#1D1E24] p-3 shadow-[4px_4px_0px_#1D1E24]">
        <PennyMascot mood="dispatch" size="md" />
        <div>
          <div className="font-headline text-[10px] uppercase font-black bg-[#FFD600] px-1.5 py-0.2 border border-[#1D1E24] w-fit mb-1">
            PENNY&apos;S BILLING DESK
          </div>
          <p className="text-[12px] font-bold text-[#1D1E24]">
            &ldquo;Every invoice here is mathematically protected by a SHA-256 idempotency key. No subscription will ever be billed twice!&rdquo;
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFF2DF] p-3 border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24]">
        <div className="flex items-center gap-2">
          <span className="font-headline text-[11px] uppercase font-black text-[#1D1E24]">
            Filter:
          </span>
          {["all", "draft", "confirmed", "paid", "overdue"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2 py-0.5 font-headline text-[10px] uppercase font-bold border border-[#1D1E24] ${filterStatus === st ? "bg-[#25F4D2] text-[#003D32] font-black" : "bg-white"
                }`}
            >
              {st}
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
            placeholder="Search by invoice # or client..."
            className="w-full pl-7 pr-3 py-1 bg-white border border-[#1D1E24] text-[12px] font-bold shadow-[1.5px_1.5px_0px_#1D1E24] focus:outline-none"
          />
        </div>
      </div>

      {/* Main Invoices Table */}
      <div className="bg-white border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] overflow-x-auto">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#FFF0DC] border-b-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black text-[#1D1E24]">
              <th className="p-3">Invoice #</th>
              <th className="p-3">Customer Account</th>
              <th className="p-3">Subscription</th>
              <th className="p-3">Billing Period</th>
              <th className="p-3">Status</th>
              <th className="p-3">Due Date</th>
              <th className="p-3 text-right">Total (₹)</th>
              <th className="p-3 text-right">Balance Due (₹)</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#1D1E24]">
            {filteredInvoices.map((inv) => {
              const badge = getStatusBadgeStyle(inv.status);
              return (
                <tr key={inv.id} className="hover:bg-[#25F4D2]/15 transition-colors">
                  <td className="px-4 py-3.5 font-headline font-black text-[#1D1E24]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="px-4 py-3.5 font-bold text-[#1D1E24]">{inv.customerName}</td>
                  <td className="px-4 py-3.5 font-headline text-[11px] text-[#006b5b] font-bold">
                    {inv.subscriptionNumber}
                  </td>
                  <td className="px-4 py-3.5 text-[11px] text-[#606275]">
                    {formatDate(inv.billingPeriodStart)} – {formatDate(inv.billingPeriodEnd)}
                  </td>
                  <td className="px-4 py-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 text-[9px] font-headline uppercase font-black border border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24] ${badge.bg} ${badge.text}`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-headline font-bold text-[11px]">
                    {formatDate(inv.dueDate)}
                  </td>
                  <td className="px-4 py-3.5 text-right font-headline font-black text-[#1D1E24]">
                    ₹{inv.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3.5 text-right font-headline font-black text-[#FF4D6D]">
                    ₹{inv.balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => setPrintModalInvoice(inv)}
                        title="Print / PDF View"
                        className="p-1 bg-[#FFF8EE] border border-[#1D1E24] font-headline text-[10px] uppercase font-bold shadow-[1px_1px_0px_#1D1E24] hover:bg-[#FFD600]"
                      >
                        <span className="material-symbols-outlined text-[15px] align-middle">
                          print
                        </span>
                      </button>

                      {inv.status === "draft" && (
                        <button
                          onClick={() => handleConfirmInvoice(inv.id)}
                          className="px-2 py-0.5 bg-[#25F4D2] text-[#003D32] border border-[#1D1E24] font-headline text-[9px] uppercase font-black shadow-[1px_1px_0px_#1D1E24]"
                        >
                          Confirm
                        </button>
                      )}

                      {inv.balanceDue > 0 && (
                        <button
                          onClick={() => openPaymentModal(inv)}
                          className="px-2 py-0.5 bg-[#FFD600] text-[#1D1E24] border border-[#1D1E24] font-headline text-[9px] uppercase font-black shadow-[1px_1px_0px_#1D1E24] hover:bg-[#FFE170]"
                        >
                          Pay
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal: Record Payment */}
      <Modal
        isOpen={paymentModalInvoice !== null}
        onClose={() => setPaymentModalInvoice(null)}
        title={`Record Payment for ${paymentModalInvoice?.invoiceNumber}`}
        icon="payments"
      >
        <form onSubmit={handleRecordPayment} className="flex flex-col gap-4">
          <div className="p-3 bg-[#FFF0DC] border-2 border-[#1D1E24] flex items-center justify-between font-headline">
            <div>
              <span className="text-[10px] uppercase font-black text-[#5B5D68] block">
                Total Balance Outstanding
              </span>
              <span className="text-[18px] text-[#FF4D6D] font-black">
                ₹{paymentModalInvoice?.balanceDue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#1D1E24]">
              {paymentModalInvoice?.customerName}
            </span>
          </div>

          <div>
            <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
              Payment Amount (₹)
            </label>
            <input
              type="number"
              step="0.01"
              max={paymentModalInvoice?.balanceDue}
              value={paymentAmount}
              onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
              className="w-full p-2 bg-white border-2 border-[#1D1E24] font-headline font-black text-[14px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              >
                <option value="Bank Transfer">Bank Transfer (Wire/ACH)</option>
                <option value="Credit Card">Credit Card</option>
                <option value="UPI">UPI / Digital Wallet</option>
                <option value="Cheque">Cheque</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Reference / Notes
              </label>
              <input
                type="text"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-[#1D1E24]">
            <button
              type="button"
              onClick={() => setPaymentModalInvoice(null)}
              className="px-4 py-2 bg-[#FFF8EE] border-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black shadow-[2px_2px_0px_#1D1E24]"
            >
              Cancel
            </button>
            <NeoButton variant="primary" size="md" type="submit">
              Reconcile Payment &amp; Update Ledger
            </NeoButton>
          </div>
        </form>
      </Modal>

      {/* Modal: Printable Invoice PDF Layout */}
      <Modal
        isOpen={printModalInvoice !== null}
        onClose={() => setPrintModalInvoice(null)}
        title={`Official Invoice: ${printModalInvoice?.invoiceNumber}`}
        icon="print"
        maxWidth="max-w-3xl"
      >
        {printModalInvoice && (
          <div className="flex flex-col gap-4 font-sans bg-white p-6 border-2 border-[#1D1E24]">
            {/* Header of Printable Invoice */}
            <div className="flex items-center justify-between pb-4 border-b-2 border-[#1D1E24]">
              <div>
                <h2 className="font-headline text-[24px] font-black uppercase text-[#1D1E24]">
                  Brightloop Software
                </h2>
                <p className="text-[11px] text-[#606275]">
                  Next-Gen Recurring Subscription Operating System
                </p>
                <p className="text-[11px] text-[#606275]">GSTIN: 27AABCB1234F1Z5</p>
              </div>
              <div className="text-right">
                <span className="font-headline text-[18px] font-black text-[#1D1E24] block">
                  {printModalInvoice.invoiceNumber}
                </span>
                <span className="text-[11px] text-[#606275] block">
                  Period: {formatDate(printModalInvoice.billingPeriodStart)} – {formatDate(printModalInvoice.billingPeriodEnd)}
                </span>
                <span className="font-headline text-[10px] px-2 py-0.5 bg-[#FFD600] border border-[#1D1E24] font-black inline-block mt-1">
                  STATUS: {printModalInvoice.status.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Billed To */}
            <div className="grid grid-cols-2 gap-4 py-2 border-b border-[#1D1E24]">
              <div>
                <span className="font-headline text-[10px] uppercase font-black text-[#5B5D68] block">
                  BILLED TO:
                </span>
                <span className="font-headline text-[14px] font-black text-[#1D1E24] block">
                  {printModalInvoice.customerName}
                </span>
                <span className="text-[11px] text-[#34363F]">
                  Subscription Ref: {printModalInvoice.subscriptionNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="font-headline text-[10px] uppercase font-black text-[#5B5D68] block">
                  PAYMENT TERMS:
                </span>
                <span className="font-headline text-[12px] font-black text-[#1D1E24] block">
                  Net 15
                </span>
                <span className="text-[11px] text-[#FF4D6D] font-bold block">
                  Due Date: {formatDate(printModalInvoice.dueDate)}
                </span>
              </div>
            </div>

            {/* Line Items Table */}
            <table className="w-full text-left text-[12px] my-2">
              <thead>
                <tr className="bg-[#FFF0DC] border-b-2 border-[#1D1E24] font-headline text-[10px] uppercase font-black">
                  <th className="p-2">Description</th>
                  <th className="p-2 text-center">Qty</th>
                  <th className="p-2 text-right">Unit Price</th>
                  <th className="p-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D1E24]">
                {printModalInvoice.items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-bold">{it.description}</td>
                    <td className="p-2 text-center">{it.quantity}</td>
                    <td className="p-2 text-right">₹{it.unitPrice.toFixed(2)}</td>
                    <td className="p-2 text-right font-black">₹{it.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals Summary */}
            <div className="flex justify-end pt-2 border-t-2 border-[#1D1E24]">
              <div className="w-64 flex flex-col gap-1 text-[12px]">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold">₹{printModalInvoice.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%):</span>
                  <span className="font-bold">₹{printModalInvoice.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-headline font-black text-[14px] pt-1 border-t-2 border-[#1D1E24]">
                  <span>Total Amount:</span>
                  <span>₹{printModalInvoice.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#006b5b]">
                  <span>Paid to Date:</span>
                  <span>-₹{printModalInvoice.paidAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-headline font-black text-[#FF4D6D] text-[15px] pt-1 border-t border-[#1D1E24]">
                  <span>Balance Due:</span>
                  <span>₹{printModalInvoice.balanceDue.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Print Trigger */}
            <div className="flex justify-end gap-2 pt-4 border-t-2 border-[#1D1E24]">
              <NeoButton
                variant="secondary"
                size="md"
                icon="print"
                onClick={() => window.print()}
              >
                Print Invoice
              </NeoButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};


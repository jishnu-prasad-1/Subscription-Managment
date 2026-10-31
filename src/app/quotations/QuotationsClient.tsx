"use client";

import React, { useState } from "react";
import { WindowCard } from "@/components/ui/WindowCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { PennyMascot } from "@/components/mascot/PennyMascot";
import { useRouter } from "next/navigation";

interface QuotationItemRow {
  productName: string;
  variantName: string;
  planName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

interface QuotationRow {
  id: string;
  quoteNumber: string;
  customerId: string;
  customerName: string;
  templateName: string;
  status: string;
  validUntil: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  items: QuotationItemRow[];
}

interface TemplateOption {
  id: string;
  name: string;
  description: string | null;
  defaultValidityDays: number;
}

interface CustomerOption {
  id: string;
  companyName: string;
  email: string;
}

interface ProductOption {
  id: string;
  name: string;
  salesPrice: number;
  variants: { id: string; variantName: string; additionalPrice: number }[];
}

interface PlanOption {
  id: string;
  name: string;
  billingInterval: string;
  baseCost: number;
}

interface QuotationsClientProps {
  initialQuotations: QuotationRow[];
  templates: TemplateOption[];
  customers: CustomerOption[];
  products: ProductOption[];
  plans: PlanOption[];
}

export const QuotationsClient: React.FC<QuotationsClientProps> = ({
  initialQuotations,
  templates,
  customers,
  products,
  plans,
}) => {
  const router = useRouter();
  const [quotations, setQuotations] = useState<QuotationRow[]>(initialQuotations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || "");
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || "");
  const [validDays, setValidDays] = useState(30);
  const [quantity, setQuantity] = useState(1);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const selectedVariant = selectedProduct?.variants.find((v) => v.id === selectedVariantId);
  const unitPrice = (selectedProduct?.salesPrice || 0) + (selectedVariant?.additionalPrice || 0);
  const subtotal = unitPrice * quantity;
  const taxAmount = (subtotal * 18) / 100;
  const totalAmount = subtotal + taxAmount;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === selectedCustomerId);
    const pl = plans.find((p) => p.id === selectedPlanId);
    const prod = products.find((p) => p.id === selectedProductId);
    const vName = selectedVariant ? selectedVariant.variantName : "Standard";

    const validUntilDate = new Date();
    validUntilDate.setDate(validUntilDate.getDate() + validDays);

    const newQuote: QuotationRow = {
      id: `quote-${Date.now()}`,
      quoteNumber: `QT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: selectedCustomerId,
      customerName: cust?.companyName || "Client Corp",
      templateName: "Custom Sales Quote",
      status: "draft",
      validUntil: validUntilDate.toISOString(),
      subtotal,
      taxAmount,
      discountAmount: 0.0,
      totalAmount,
      items: [
        {
          productName: prod?.name || "Product",
          variantName: vName,
          planName: pl?.name || "Plan",
          quantity,
          unitPrice,
          totalAmount,
        },
      ],
    };

    setQuotations([newQuote, ...quotations]);
    setIsModalOpen(false);
    showToast(`Drafted Quotation ${newQuote.quoteNumber} (Total: $${totalAmount.toFixed(2)})!`);
  };

  // 1-Click Convert to Subscription!
  const handleConvertToSubscription = (quote: QuotationRow) => {
    setQuotations((prev) =>
      prev.map((q) => (q.id === quote.id ? { ...q, status: "accepted" } : q))
    );
    showToast(`🎉 1-Click Conversion Success! ${quote.quoteNumber} converted to a CONFIRMED Subscription!`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFD600] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] px-4 py-2 font-headline text-[12px] font-black uppercase animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Top Banner */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-[#1D1E24] p-4 shadow-[4px_4px_0px_#1D1E24]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFD600] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24]">
            <span className="material-symbols-outlined text-[28px] text-[#1D1E24] font-black">
              request_quote
            </span>
          </div>
          <div>
            <h1 className="font-headline text-[20px] uppercase font-black text-[#1D1E24]">
              Quotations &amp; Sales Proposals
            </h1>
            <p className="text-[12px] text-[#606275] font-semibold">
              Generate structured sales quotes with preset templates, validity bounds &amp; 1-click subscription conversion
            </p>
          </div>
        </div>

        <NeoButton
          variant="secondary"
          size="md"
          icon="add"
          onClick={() => setIsModalOpen(true)}
        >
          + Create Quotation
        </NeoButton>
      </section>

      {/* Quotations Data Grid */}
      <div className="bg-white border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] overflow-x-auto">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#FFF0DC] border-b-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black text-[#1D1E24]">
              <th className="p-3">Quote #</th>
              <th className="p-3">Customer Account</th>
              <th className="p-3">Offer Lines</th>
              <th className="p-3">Valid Until</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Total ($)</th>
              <th className="p-3 text-center">Conversion Action</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#1D1E24]">
            {quotations.map((q) => (
              <tr key={q.id} className="hover:bg-[#25F4D2]/15 transition-colors">
                <td className="p-3 font-headline font-black text-[#1D1E24]">
                  {q.quoteNumber}
                </td>
                <td className="p-3 font-bold text-[#1D1E24]">{q.customerName}</td>
                <td className="p-3 text-[11px] text-[#34363F]">
                  {q.items.length > 0
                    ? `${q.items[0].productName} (${q.items[0].variantName}) × ${q.items[0].quantity}`
                    : "Standard Package"}
                </td>
                <td className="p-3 font-headline font-bold text-[11px]">
                  {formatDate(q.validUntil)}
                </td>
                <td className="p-3">
                  <span
                    className={`inline-block px-2 py-0.5 text-[9px] font-headline uppercase font-black border border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24] ${
                      q.status === "accepted"
                        ? "bg-[#25F4D2] text-[#003D32]"
                        : q.status === "sent"
                        ? "bg-[#00C2E8] text-[#1D1E24]"
                        : "bg-[#FFD600] text-[#1D1E24]"
                    }`}
                  >
                    {q.status}
                  </span>
                </td>
                <td className="p-3 text-right font-headline font-black text-[#1D1E24]">
                  ${q.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="p-3 text-center">
                  {q.status === "accepted" ? (
                    <span className="font-headline text-[10px] uppercase font-black text-[#006b5b] bg-[#25F4D2]/60 px-2 py-0.5 border border-[#1D1E24]">
                      Converted to Sub
                    </span>
                  ) : (
                    <button
                      onClick={() => handleConvertToSubscription(q)}
                      className="px-3 py-1 bg-[#25F4D2] text-[#003D32] border-2 border-[#1D1E24] font-headline text-[10px] uppercase font-black shadow-[2px_2px_0px_#1D1E24] hover:bg-[#38EFD0] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    >
                      Convert to Subscription ➔
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal: New Quotation */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Draft New Quotation Proposal"
        icon="request_quote"
      >
        <form onSubmit={handleCreateQuotation} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2.5 bg-[#FFF0DC] border-2 border-[#1D1E24]">
            <PennyMascot mood="dispatch" size="sm" />
            <p className="text-[12px] font-bold text-[#1D1E24]">
              &ldquo;Quotes stay valid for a set number of days. Once accepted, they convert with 1 click!&rdquo;
            </p>
          </div>

          <div>
            <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
              Select Customer
            </label>
            <select
              value={selectedCustomerId}
              onChange={(e) => setSelectedCustomerId(e.target.value)}
              className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            >
              {customers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.companyName} ({c.email})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Product SKU
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setSelectedVariantId("");
                }}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.salesPrice})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Variant (e.g. Odoo Brand +₹560)
              </label>
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              >
                <option value="">Standard Edition (+0)</option>
                {selectedProduct?.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.variantName} (+${v.additionalPrice})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Target Plan
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              >
                {plans.map((pl) => (
                  <option key={pl.id} value={pl.id}>
                    {pl.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Validity (Days)
              </label>
              <input
                type="number"
                min="1"
                max="90"
                value={validDays}
                onChange={(e) => setValidDays(parseInt(e.target.value) || 30)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
          </div>

          {/* Pricing Math Breakdown */}
          <div className="p-3 bg-[#FFE170]/40 border-2 border-[#1D1E24] flex items-center justify-between text-[12px]">
            <div>
              <span>Subtotal: ${subtotal.toFixed(2)}</span> |{" "}
              <span>GST (18%): ${taxAmount.toFixed(2)}</span>
            </div>
            <div className="font-headline font-black text-[16px] text-[#1D1E24]">
              Total: ${totalAmount.toFixed(2)}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-[#1D1E24]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-[#FFF8EE] border-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black shadow-[2px_2px_0px_#1D1E24]"
            >
              Cancel
            </button>
            <NeoButton variant="secondary" size="md" type="submit">
              Issue Quotation
            </NeoButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

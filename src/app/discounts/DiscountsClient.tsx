"use client";

import React, { useState } from "react";
import { WindowCard } from "@/components/ui/WindowCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { Modal } from "@/components/ui/Modal";
import { formatDate } from "@/lib/utils";
import { PennyMascot } from "@/components/mascot/PennyMascot";

interface DiscountRow {
  id: string;
  code: string;
  name: string;
  discountType: string;
  value: number;
  minPurchaseAmount: number;
  minQuantity: number;
  appliesTo: string;
  productName: string;
  startDate: string;
  endDate: string;
  maxUsageLimit: number;
  currentUsageCount: number;
  isActive: boolean;
}

interface DiscountsClientProps {
  initialDiscounts: DiscountRow[];
}

export const DiscountsClient: React.FC<DiscountsClientProps> = ({ initialDiscounts }) => {
  const [discounts, setDiscounts] = useState<DiscountRow[]>(initialDiscounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [discountType, setDiscountType] = useState("percentage");
  const [value, setValue] = useState(15);
  const [minPurchase, setMinPurchase] = useState(1000);
  const [minQuantity, setMinQuantity] = useState(1);
  const [maxUsage, setMaxUsage] = useState(100);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    const newDisc: DiscountRow = {
      id: `disc-${Date.now()}`,
      code: code.toUpperCase(),
      name,
      discountType,
      value,
      minPurchaseAmount: minPurchase,
      minQuantity,
      appliesTo: "subscription",
      productName: "All Products",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 90 * 86400000).toISOString(),
      maxUsageLimit: maxUsage,
      currentUsageCount: 0,
      isActive: true,
    };

    setDiscounts([newDisc, ...discounts]);
    setIsModalOpen(false);
    showToast(`Created Discount Rule '${code.toUpperCase()}'!`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFD600] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] px-4 py-2 font-headline text-[12px] font-black uppercase animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-[#1D1E24] p-4 shadow-[4px_4px_0px_#1D1E24]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFD600] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24]">
            <span className="material-symbols-outlined text-[28px] text-[#1D1E24] font-black">
              loyalty
            </span>
          </div>
          <div>
            <h1 className="font-headline text-[20px] uppercase font-black text-[#1D1E24]">
              Discount &amp; Promotion Rules
            </h1>
            <p className="text-[12px] text-[#606275] font-semibold">
              Fixed &amp; percentage discounts with minimum thresholds, date constraints &amp; automatic retirement upon usage exhaustion
            </p>
          </div>
        </div>

        <NeoButton
          variant="secondary"
          size="md"
          icon="add"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Discount Rule
        </NeoButton>
      </section>

      {/* Discounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {discounts.map((d) => (
          <WindowCard
            key={d.id}
            title={d.name}
            icon="loyalty"
            badge={d.code}
            badgeColor="bg-[#25F4D2]"
          >
            <div className="flex flex-col justify-between h-full gap-4">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-headline text-[28px] font-black text-[#1D1E24]">
                    {d.discountType === "percentage" ? `${d.value}% OFF` : `$${d.value} OFF`}
                  </span>
                  <span className="font-headline text-[10px] uppercase font-bold text-[#606275]">
                    {d.appliesTo}
                  </span>
                </div>

                {/* Eligibility Requirements */}
                <div className="p-2.5 bg-[#FFF0DC] border border-[#1D1E24] text-[11px] font-bold flex flex-col gap-1 mb-3">
                  <div>
                    Min Purchase: <strong className="text-[#1D1E24]">${d.minPurchaseAmount}</strong>
                  </div>
                  <div>
                    Min Volume: <strong className="text-[#1D1E24]">{d.minQuantity} Seats</strong>
                  </div>
                  <div>
                    Valid: {formatDate(d.startDate)} – {formatDate(d.endDate)}
                  </div>
                </div>

                {/* Usage Cap Progress Bar */}
                <div>
                  <div className="flex justify-between text-[11px] font-headline font-black mb-1">
                    <span>Usage Meter</span>
                    <span>
                      {d.currentUsageCount} / {d.maxUsageLimit} Claims
                    </span>
                  </div>
                  <div className="w-full bg-[#EED2AF] border border-[#1D1E24] h-2.5 p-0.5">
                    <div
                      className="bg-[#25F4D2] h-full"
                      style={{
                        width: `${Math.min(100, (d.currentUsageCount / d.maxUsageLimit) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1D1E24]/20 font-headline text-[11px]">
                <span
                  className={
                    d.currentUsageCount >= d.maxUsageLimit
                      ? "text-[#FF4D6D] font-black"
                      : "text-[#006b5b] font-black"
                  }
                >
                  {d.currentUsageCount >= d.maxUsageLimit ? "● Retired (Cap Met)" : "● Active"}
                </span>
                <span className="font-bold text-[#5B5D68]">Admin Protected</span>
              </div>
            </div>
          </WindowCard>
        ))}
      </div>

      {/* Modal: Add Discount */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Author New Promotional Discount Rule"
        icon="loyalty"
      >
        <form onSubmit={handleCreateDiscount} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2.5 bg-[#FFF0DC] border-2 border-[#1D1E24]">
            <PennyMascot mood="dispatch" size="sm" />
            <p className="text-[12px] font-bold text-[#1D1E24]">
              &ldquo;Only Admins can author discount rules. They apply automatically when eligible!&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Discount Code
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SUMMER25"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-headline font-black text-[12px] uppercase shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Rule Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mid-Year Growth Rebate"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Dollar ($)</option>
              </select>
            </div>
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Value ({discountType === "percentage" ? "%" : "$"})
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Min Spend ($)
              </label>
              <input
                type="number"
                value={minPurchase}
                onChange={(e) => setMinPurchase(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Min Seats
              </label>
              <input
                type="number"
                value={minQuantity}
                onChange={(e) => setMinQuantity(parseInt(e.target.value) || 1)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Max Claims Cap
              </label>
              <input
                type="number"
                value={maxUsage}
                onChange={(e) => setMaxUsage(parseInt(e.target.value) || 100)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
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
              Activate Discount Rule
            </NeoButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

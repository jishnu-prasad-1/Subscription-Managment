"use client";

import React, { useState } from "react";
import { WindowCard } from "@/components/ui/WindowCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { Modal } from "@/components/ui/Modal";
import { PennyMascot } from "@/components/mascot/PennyMascot";

interface PlanRow {
  id: string;
  name: string;
  billingInterval: string;
  baseCost: number;
  minQuantity: number;
  autoClose: boolean;
  allowEarlyClosure: boolean;
  allowPause: boolean;
  allowRenewal: boolean;
  isActive: boolean;
  subscriberCount: number;
}

interface PlansClientProps {
  initialPlans: PlanRow[];
}

export const PlansClient: React.FC<PlansClientProps> = ({ initialPlans }) => {
  const [plans, setPlans] = useState<PlanRow[]>(initialPlans);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [billingInterval, setBillingInterval] = useState("monthly");
  const [baseCost, setBaseCost] = useState(1500);
  const [minQuantity, setMinQuantity] = useState(1);
  const [autoClose, setAutoClose] = useState(false);
  const [allowEarlyClosure, setAllowEarlyClosure] = useState(true);
  const [allowPause, setAllowPause] = useState(true);
  const [allowRenewal, setAllowRenewal] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    const newPlan: PlanRow = {
      id: `plan-${Date.now()}`,
      name,
      billingInterval,
      baseCost,
      minQuantity,
      autoClose,
      allowEarlyClosure,
      allowPause,
      allowRenewal,
      isActive: true,
      subscriberCount: 0,
    };

    setPlans([newPlan, ...plans]);
    setIsModalOpen(false);
    showToast(`Created new plan '${name}' with ${billingInterval} interval!`);
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
          <div className="w-12 h-12 bg-[#25F4D2] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24]">
            <span className="material-symbols-outlined text-[28px] text-[#003D32] font-black">
              layers
            </span>
          </div>
          <div>
            <h1 className="font-headline text-[20px] uppercase font-black text-[#1D1E24]">
              Subscription Plan Engine
            </h1>
            <p className="text-[12px] text-[#606275] font-semibold">
              Configure recurrence intervals (Daily, Weekly, Monthly, Yearly) and contract lifecycle rules
            </p>
          </div>
        </div>

        <NeoButton
          variant="secondary"
          size="md"
          icon="add"
          onClick={() => setIsModalOpen(true)}
        >
          + Create New Plan
        </NeoButton>
      </section>

      {/* Plans Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((pl) => (
          <WindowCard
            key={pl.id}
            title={pl.name}
            icon="schedule"
            badge={pl.billingInterval.toUpperCase()}
            badgeColor="bg-[#FFD600]"
          >
            <div className="flex flex-col justify-between h-full gap-4">
              <div>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-headline text-[26px] font-black text-[#1D1E24]">
                    ${pl.baseCost.toLocaleString()}
                  </span>
                  <span className="font-headline text-[11px] text-[#606275] uppercase font-black">
                    / {pl.billingInterval}
                  </span>
                </div>

                <div className="p-2 bg-[#FFF0DC] border border-[#1D1E24] text-[11px] font-bold mb-3">
                  Minimum Quantity: <span className="font-black text-[#1D1E24]">{pl.minQuantity} Seats</span>
                </div>

                {/* Lifecycle Rules Tags */}
                <div className="flex flex-col gap-1.5 font-headline text-[10px] uppercase font-black">
                  <span className="text-[#5B5D68]">Contract Rules:</span>
                  <div className="flex flex-wrap gap-1">
                    <span
                      className={`px-1.5 py-0.5 border border-[#1D1E24] ${
                        pl.autoClose ? "bg-[#FFCCD5] text-[#FF3355]" : "bg-white text-[#5B5D68]"
                      }`}
                    >
                      {pl.autoClose ? "Auto-Close: ON" : "Auto-Close: OFF"}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 border border-[#1D1E24] ${
                        pl.allowPause ? "bg-[#25F4D2] text-[#003D32]" : "bg-white text-[#5B5D68]"
                      }`}
                    >
                      {pl.allowPause ? "Pause Allowed" : "Pause Locked"}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 border border-[#1D1E24] ${
                        pl.allowEarlyClosure ? "bg-[#FFE170] text-[#1D1E24]" : "bg-white text-[#5B5D68]"
                      }`}
                    >
                      {pl.allowEarlyClosure ? "Early Term Allowed" : "Fixed Term"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1D1E24]/20 font-headline text-[11px]">
                <span className="text-[#006b5b] font-bold">
                  ● Active ({pl.subscriberCount} subs)
                </span>
                <button
                  onClick={() => showToast(`Opening rule editor for ${pl.name}...`)}
                  className="px-2 py-0.5 bg-[#FFF8EE] border border-[#1D1E24] font-black uppercase shadow-[1px_1px_0px_#1D1E24] hover:bg-[#FFD600]"
                >
                  Config
                </button>
              </div>
            </div>
          </WindowCard>
        ))}
      </div>

      {/* Modal: Add Plan */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Configure Recurring Billing Plan"
        icon="schedule"
      >
        <form onSubmit={handleCreatePlan} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2.5 bg-[#FFF0DC] border-2 border-[#1D1E24]">
            <PennyMascot mood="dispatch" size="sm" />
            <p className="text-[12px] font-bold text-[#1D1E24]">
              &ldquo;Choose how often this plan bills: Daily, Weekly, Monthly, or Yearly!&rdquo;
            </p>
          </div>

          <div>
            <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
              Plan Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Enterprise Annual Pro"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Recurrence Cadence
              </label>
              <select
                value={billingInterval}
                onChange={(e) => setBillingInterval(e.target.value)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Base Cost ($)
              </label>
              <input
                type="number"
                value={baseCost}
                onChange={(e) => setBaseCost(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Min Quantity
              </label>
              <input
                type="number"
                min="1"
                value={minQuantity}
                onChange={(e) => setMinQuantity(parseInt(e.target.value) || 1)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
          </div>

          {/* Lifecycle Checkboxes */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-[#FFF2DF] border-2 border-[#1D1E24] font-headline text-[11px]">
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={autoClose}
                onChange={(e) => setAutoClose(e.target.checked)}
                className="w-4 h-4 accent-[#00BFA0] border-2 border-[#1D1E24]"
              />
              <span>Auto-Close on End Date</span>
            </label>

            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={allowEarlyClosure}
                onChange={(e) => setAllowEarlyClosure(e.target.checked)}
                className="w-4 h-4 accent-[#00BFA0] border-2 border-[#1D1E24]"
              />
              <span>Allow Early Termination</span>
            </label>

            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={allowPause}
                onChange={(e) => setAllowPause(e.target.checked)}
                className="w-4 h-4 accent-[#00BFA0] border-2 border-[#1D1E24]"
              />
              <span>Allow Pausing Recurrence</span>
            </label>

            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={allowRenewal}
                onChange={(e) => setAllowRenewal(e.target.checked)}
                className="w-4 h-4 accent-[#00BFA0] border-2 border-[#1D1E24]"
              />
              <span>Allow Contract Renewal</span>
            </label>
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
              Save Plan
            </NeoButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

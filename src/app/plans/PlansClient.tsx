"use client";

import React, { useState } from "react";
import Link from "next/link";
import { WindowCard } from "@/components/ui/WindowCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { Modal } from "@/components/ui/Modal";
import { PennyMascot } from "@/components/mascot/PennyMascot";
import { exportToCsv } from "@/lib/exportCsv";
import { useRole } from "@/context/RoleContext";

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
  const { role, switchWorkspace, canManagePlans } = useRole();
  const [plans, setPlans] = useState<PlanRow[]>(initialPlans);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanRow | null>(null);
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

  // Edit State
  const [editName, setEditName] = useState("");
  const [editBaseCost, setEditBaseCost] = useState(0);
  const [editMinQuantity, setEditMinQuantity] = useState(1);
  const [editAutoClose, setEditAutoClose] = useState(false);
  const [editAllowPause, setEditAllowPause] = useState(true);
  const [editAllowEarlyClosure, setEditAllowEarlyClosure] = useState(true);
  const [editAllowRenewal, setEditAllowRenewal] = useState(true);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleOpenConfig = (pl: PlanRow) => {
    setEditingPlan(pl);
    setEditName(pl.name);
    setEditBaseCost(pl.baseCost);
    setEditMinQuantity(pl.minQuantity);
    setEditAutoClose(pl.autoClose);
    setEditAllowPause(pl.allowPause);
    setEditAllowEarlyClosure(pl.allowEarlyClosure);
    setEditAllowRenewal(pl.allowRenewal);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;

    setPlans((prev) =>
      prev.map((p) =>
        p.id === editingPlan.id
          ? {
              ...p,
              name: editName,
              baseCost: Number(editBaseCost),
              minQuantity: Number(editMinQuantity),
              autoClose: editAutoClose,
              allowPause: editAllowPause,
              allowEarlyClosure: editAllowEarlyClosure,
              allowRenewal: editAllowRenewal,
            }
          : p
      )
    );
    showToast(`Updated contract rules for '${editName}'!`);
    setEditingPlan(null);
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

  const handleExportPlans = () => {
    const headers = [
      "Plan Name",
      "Cadence",
      "Base Cost (₹)",
      "Min Seats",
      "Auto-Close",
      "Pause Allowed",
      "Early Term Allowed",
      "Subscribers",
    ];
    const rows = plans.map((p) => [
      p.name,
      p.billingInterval.toUpperCase(),
      p.baseCost,
      p.minQuantity,
      p.autoClose ? "YES" : "NO",
      p.allowPause ? "YES" : "NO",
      p.allowEarlyClosure ? "YES" : "NO",
      p.subscriberCount,
    ]);
    exportToCsv("brightloop_plans_matrix.csv", headers, rows);
    showToast(`📁 Exported ${rows.length} plans to CSV!`);
  };

  const filteredPlans = plans.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.billingInterval.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (role === "CUSTOMER") {
    return (
      <div className="p-8 bg-white border-[3px] border-[#1D1E24] shadow-[6px_6px_0px_#1D1E24] text-center max-w-2xl mx-auto my-12 animate-in zoom-in-95">
        <div className="w-16 h-16 bg-[#FF4D6D] text-white border-2 border-[#1D1E24] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#1D1E24]">
          <span className="material-symbols-outlined text-[36px]">layers</span>
        </div>
        <h2 className="font-headline text-[22px] font-black uppercase text-[#1D1E24] mb-2">
          Access Restricted: Customer Tenant Boundary
        </h2>
        <p className="text-[13px] text-[#606275] font-semibold mb-6 leading-relaxed">
          You are currently signed in as <strong>Customer (David Vance - Acme Corp)</strong>. Recurring plan architecture, base price definitions, and contract lifecycle rules are administered by Super Admins.
        </p>
        <div className="flex justify-center gap-3">
          <Link href="/portal">
            <NeoButton variant="primary" size="md" icon="storefront">
              Return to My Customer Portal ➔
            </NeoButton>
          </Link>
          <button
            type="button"
            onClick={() => switchWorkspace("ADMIN")}
            className="px-4 py-2 bg-[#25F4D2] text-[#003D32] border-2 border-[#1D1E24] font-headline text-[12px] font-black uppercase shadow-[2px_2px_0px_#1D1E24] hover:bg-[#38EFD0]"
          >
            Switch to Admin View
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFD600] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] px-4 py-2 font-headline text-[12px] font-black uppercase animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Header Banner - Comfortable Spacing */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-[#1D1E24] p-5 sm:p-6 shadow-[4px_4px_0px_#1D1E24]">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 bg-[#25F4D2] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24] shrink-0">
            <span className="material-symbols-outlined text-[32px] text-[#003D32] font-black">
              layers
            </span>
          </div>
          <div>
            <h1 className="font-headline text-[22px] uppercase font-black text-[#1D1E24]">
              Subscription Plan Engine
            </h1>
            <p className="text-[13px] text-[#606275] font-semibold mt-0.5">
              Configure recurrence intervals (Daily, Weekly, Monthly, Yearly) and contract lifecycle rules
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <NeoButton
            variant="ghost"
            size="sm"
            icon="download"
            onClick={handleExportPlans}
          >
            Export Plans
          </NeoButton>
          {canManagePlans ? (
            <NeoButton
              variant="secondary"
              size="md"
              icon="add"
              onClick={() => setIsModalOpen(true)}
            >
              + Create New Plan
            </NeoButton>
          ) : (
            <span className="px-3 py-1.5 bg-[#FFF0DC] border-2 border-[#1D1E24] font-headline text-[11px] font-black uppercase text-[#606275]">
              Staff View (Pricing Reference)
            </span>
          )}
        </div>
      </section>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFF2DF] p-3 border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24]">
        <div className="flex items-center gap-2">
          <span className="font-headline text-[11px] uppercase font-black text-[#1D1E24]">
            Configured Intervals:
          </span>
          <span className="px-2 py-0.5 bg-[#25F4D2] text-[#003D32] border border-[#1D1E24] font-headline text-[10px] uppercase font-black">
            Daily • Weekly • Monthly • Yearly ({plans.length})
          </span>
        </div>

        <div className="relative flex items-center w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-2 text-[#1D1E24] text-[16px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plans by cadence..."
            className="w-full pl-7 pr-3 py-1 bg-white border border-[#1D1E24] text-[12px] font-bold shadow-[1.5px_1.5px_0px_#1D1E24] focus:outline-none"
          />
        </div>
      </div>

      {/* Plans Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredPlans.map((pl) => (
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
                    ₹{pl.baseCost.toLocaleString()}
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
                {canManagePlans ? (
                  <button
                    onClick={() => handleOpenConfig(pl)}
                    className="px-2.5 py-1 bg-[#25F4D2] text-[#003D32] border border-[#1D1E24] font-black uppercase text-[10px] shadow-[1.5px_1.5px_0px_#1D1E24] hover:bg-[#38EFD0] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                  >
                    Config Rules
                  </button>
                ) : (
                  <span className="text-[10px] font-headline font-bold uppercase text-[#606275]">
                    Standard Tier
                  </span>
                )}
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
                Interval
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
                Base Cost (₹)
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
                value={minQuantity}
                onChange={(e) => setMinQuantity(parseInt(e.target.value) || 1)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 p-3 bg-[#FFF8EE] border-2 border-[#1D1E24]">
            <span className="font-headline text-[11px] uppercase font-black text-[#1D1E24]">
              Lifecycle Governance Rules
            </span>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={autoClose}
                  onChange={(e) => setAutoClose(e.target.checked)}
                  className="accent-[#00BFA0]"
                />
                <span className="font-bold">Auto-Close on End</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allowPause}
                  onChange={(e) => setAllowPause(e.target.checked)}
                  className="accent-[#00BFA0]"
                />
                <span className="font-bold">Allow Customer Pause</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allowEarlyClosure}
                  onChange={(e) => setAllowEarlyClosure(e.target.checked)}
                  className="accent-[#00BFA0]"
                />
                <span className="font-bold">Allow Early Termination</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={allowRenewal}
                  onChange={(e) => setAllowRenewal(e.target.checked)}
                  className="accent-[#00BFA0]"
                />
                <span className="font-bold">Allow Auto-Renewal</span>
              </label>
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
              Save Plan
            </NeoButton>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Plan Rule Config */}
      <Modal
        isOpen={editingPlan !== null}
        onClose={() => setEditingPlan(null)}
        title={`Plan Governance: ${editingPlan?.name}`}
        icon="tune"
      >
        <form onSubmit={handleSaveConfig} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2.5 bg-[#FFF0DC] border-2 border-[#1D1E24]">
            <PennyMascot mood="dispatch" size="sm" />
            <p className="text-[12px] font-bold text-[#1D1E24]">
              &ldquo;Update contract terms, pause permissions, and base pricing!&rdquo;
            </p>
          </div>

          <div>
            <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
              Plan Title
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Base Cost (₹)
              </label>
              <input
                type="number"
                required
                value={editBaseCost}
                onChange={(e) => setEditBaseCost(parseFloat(e.target.value) || 0)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Min Quantity (Seats)
              </label>
              <input
                type="number"
                required
                value={editMinQuantity}
                onChange={(e) => setEditMinQuantity(parseInt(e.target.value) || 1)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 p-3 bg-[#FFF8EE] border-2 border-[#1D1E24]">
            <span className="font-headline text-[11px] uppercase font-black text-[#1D1E24]">
              Live Governance Flags
            </span>
            <div className="grid grid-cols-2 gap-2 text-[12px]">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editAutoClose}
                  onChange={(e) => setEditAutoClose(e.target.checked)}
                  className="accent-[#00BFA0]"
                />
                <span className="font-bold">Auto-Close on End</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editAllowPause}
                  onChange={(e) => setEditAllowPause(e.target.checked)}
                  className="accent-[#00BFA0]"
                />
                <span className="font-bold">Allow Pause</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editAllowEarlyClosure}
                  onChange={(e) => setEditAllowEarlyClosure(e.target.checked)}
                  className="accent-[#00BFA0]"
                />
                <span className="font-bold">Allow Early Term</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editAllowRenewal}
                  onChange={(e) => setEditAllowRenewal(e.target.checked)}
                  className="accent-[#00BFA0]"
                />
                <span className="font-bold">Allow Auto-Renewal</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-[#1D1E24]">
            <button
              type="button"
              onClick={() => setEditingPlan(null)}
              className="px-4 py-2 bg-[#FFF8EE] border-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black shadow-[2px_2px_0px_#1D1E24]"
            >
              Cancel
            </button>
            <NeoButton variant="secondary" size="md" type="submit">
              Update Contract Rules
            </NeoButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};

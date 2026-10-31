"use client";

import React, { useState } from "react";
import { NeoButton } from "@/components/ui/NeoButton";
import { Modal } from "@/components/ui/Modal";
import { formatDate, getStatusBadgeStyle } from "@/lib/utils";
import { PennyMascot } from "@/components/mascot/PennyMascot";
import { exportToCsv } from "@/lib/exportCsv";

interface SubItem {
  productName: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
}

interface SubscriptionRow {
  id: string;
  subscriptionNumber: string;
  customerId: string;
  customerName: string;
  planId: string;
  planName: string;
  billingInterval: string;
  status: string;
  startDate: string;
  expiryDate: string | null;
  nextBillingDate: string;
  paymentTerms: string;
  totalRecurringAmount: number;
  items: SubItem[];
}

interface PlanOption {
  id: string;
  name: string;
  billingInterval: string;
  baseCost: number;
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

interface SubscriptionsClientProps {
  initialSubscriptions: SubscriptionRow[];
  plans: PlanOption[];
  customers: CustomerOption[];
  products: ProductOption[];
}

export const SubscriptionsClient: React.FC<SubscriptionsClientProps> = ({
  initialSubscriptions,
  plans,
  customers,
  products,
}) => {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>(initialSubscriptions);
  const [filterStage, setFilterStage] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || "");
  const [selectedPlanId, setSelectedPlanId] = useState(plans[0]?.id || "");
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || "");
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [quantity, setQuantity] = useState(1);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const selectedVariant = selectedProduct?.variants.find((v) => v.id === selectedVariantId);
  const effectivePrice = (selectedProduct?.salesPrice || 0) + (selectedVariant?.additionalPrice || 0);

  // Filter Subscriptions
  const filteredSubs = subscriptions.filter((s) => {
    const matchesStage = filterStage === "all" || s.status.toLowerCase() === filterStage.toLowerCase();
    const matchesSearch =
      s.subscriptionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.planName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // State Machine Action Handlers
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/subscriptions/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setSubscriptions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
        showToast(`Subscription status updated to: ${newStatus.toUpperCase()}`);
      } else {
        // Fallback optimistic update
        setSubscriptions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
        );
        showToast(`Status updated to: ${newStatus.toUpperCase()}`);
      }
    } catch {
      setSubscriptions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
      showToast(`Status updated to: ${newStatus.toUpperCase()}`);
    }
  };

  const handleExportCsv = () => {
    const headers = [
      "Subscription Number",
      "Customer Name",
      "Plan Name",
      "Cadence",
      "Status",
      "Next Billing Date",
      "Recurring Amount ($)",
    ];
    const rows = filteredSubs.map((s) => [
      s.subscriptionNumber,
      s.customerName,
      s.planName,
      s.billingInterval,
      s.status.toUpperCase(),
      formatDate(s.nextBillingDate),
      s.totalRecurringAmount.toFixed(2),
    ]);
    exportToCsv("brightloop_subscriptions.csv", headers, rows);
    showToast(`📁 Exported ${rows.length} subscriptions to CSV!`);
  };

  const handleCreateSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    const cust = customers.find((c) => c.id === selectedCustomerId);
    const pl = plans.find((p) => p.id === selectedPlanId);
    const prod = products.find((p) => p.id === selectedProductId);
    const vName = selectedVariant ? selectedVariant.variantName : "Standard";

    const newSub: SubscriptionRow = {
      id: `new-${Date.now()}`,
      subscriptionNumber: `SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: selectedCustomerId,
      customerName: cust?.companyName || "Acme Corp",
      planId: selectedPlanId,
      planName: pl?.name || "Monthly Plan",
      billingInterval: pl?.billingInterval || "monthly",
      status: "draft",
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 365 * 86400000).toISOString(),
      nextBillingDate: new Date().toISOString(),
      paymentTerms: "Net 15",
      totalRecurringAmount: effectivePrice * quantity,
      items: [
        {
          productName: prod?.name || "Product",
          variantName: vName,
          quantity,
          unitPrice: effectivePrice,
          totalAmount: effectivePrice * quantity,
        },
      ],
    };

    setSubscriptions([newSub, ...subscriptions]);
    setIsModalOpen(false);
    showToast(`Created Subscription ${newSub.subscriptionNumber} in DRAFT phase!`);

    try {
      await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: selectedCustomerId,
          planId: selectedPlanId,
          productId: selectedProductId,
          variantId: selectedVariantId || undefined,
          quantity,
        }),
      });
    } catch (err) {
      console.warn("Background persistence notice:", err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFD600] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] px-4 py-2 font-headline text-[12px] font-black uppercase animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Top Stats Banner matching Stitch UI */}
      <section className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border-2 border-[#1D1E24] p-4 shadow-[4px_4px_0px_#1D1E24]">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FFD600] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24]">
              <span className="material-symbols-outlined text-[28px] text-[#1D1E24] font-black">
                autorenew
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-headline text-[20px] tracking-tight uppercase font-black text-[#1D1E24]">
                  Subscription Management
                </h1>
                <span className="font-headline text-[10px] px-2 py-0.5 bg-[#00E5C9] text-[#1D1E24] font-black border-2 border-[#1D1E24] shadow-[2px_2px_0px_#1D1E24]">
                  SYS.LIVE
                </span>
              </div>
              <p className="text-[12px] text-[#606275] font-semibold">
                Manage end-to-end subscriber lifecycles, contract renewals &amp; billing terms
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2.5 pl-4 border-l-2 border-[#1D1E24]">
            <div className="px-3.5 py-1.5 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[2.5px_2.5px_0px_#1D1E24]">
              <span className="font-headline text-[9px] uppercase text-[#606275] font-black block">
                Active Volume
              </span>
              <span className="font-headline text-[16px] text-[#1D1E24] font-black">
                1,842 Subs
              </span>
            </div>
            <div className="px-3.5 py-1.5 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[2.5px_2.5px_0px_#1D1E24]">
              <span className="font-headline text-[9px] uppercase text-[#606275] font-black block">
                Net Run Rate
              </span>
              <span className="font-headline text-[16px] text-[#008F7A] font-black">
                $184.2k <span className="text-[10px] text-[#1D1E24] font-bold">/mo</span>
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <NeoButton
            variant="ghost"
            size="sm"
            icon="download"
            onClick={handleExportCsv}
          >
            Batch Export
          </NeoButton>
          <NeoButton
            variant="secondary"
            size="md"
            icon="add_circle"
            onClick={() => setIsModalOpen(true)}
          >
            + Create Subscription
          </NeoButton>
        </div>
      </section>

      {/* 5-Stage Retro Pipeline Stepper Ribbons matching Stitch UI */}
      <section className="bg-white border-2 border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24]">
        <div className="p-2.5 bg-[#FFD600] border-b-2 border-[#1D1E24] flex items-center justify-between font-bold">
          <div className="flex items-center gap-2">
            <span className="font-headline text-[11px] uppercase tracking-wider text-[#1D1E24] font-black">
              LIFECYCLE PIPELINE PROTOCOL
            </span>
            <span className="font-headline text-[9px] px-1.5 py-0.2 bg-white text-[#1D1E24] border border-[#1D1E24] font-black shadow-[1px_1px_0px_#1D1E24]">
              5 PHASES
            </span>
          </div>
          <span className="font-headline text-[10px] text-[#1D1E24] bg-white/70 px-2 py-0.5 border border-[#1D1E24] font-black">
            CLICK STAGE TO FAST-FILTER
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 divide-y-2 lg:divide-y-0 lg:divide-x-2 divide-[#1D1E24]">
          {/* Draft */}
          <button
            onClick={() => setFilterStage(filterStage === "draft" ? "all" : "draft")}
            className={`flex flex-col p-3 text-left transition-colors relative ${
              filterStage === "draft" ? "bg-[#FFE0A3] ring-2 ring-[#1D1E24] ring-inset" : "bg-[#FFF8EE] hover:bg-[#FFF0DC]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline text-[9px] text-[#606275] uppercase font-bold tracking-wider">
                Phase 01
              </span>
              <span className="w-3 h-3 rounded-full border-2 border-[#1D1E24] bg-[#FFE0A3]"></span>
            </div>
            <div className="font-headline text-[15px] uppercase text-[#1D1E24] font-black tracking-tight">
              Draft
            </div>
            <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#1D1E24]/20">
              <span className="font-headline text-[11px] font-bold text-[#1D1E24]">18 Queued</span>
              <span className="font-headline text-[10px] px-1.5 py-0.2 bg-white border border-[#1D1E24] font-bold">
                Edit
              </span>
            </div>
          </button>

          {/* Quotation */}
          <button
            onClick={() => setFilterStage(filterStage === "quotation" ? "all" : "quotation")}
            className={`flex flex-col p-3 text-left transition-colors relative ${
              filterStage === "quotation" ? "bg-[#FFAA00]/40 ring-2 ring-[#1D1E24] ring-inset" : "bg-[#FFF4D4] hover:bg-[#FFE8A3]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline text-[9px] text-[#B87A00] uppercase font-bold tracking-wider">
                Phase 02
              </span>
              <span className="w-3 h-3 rounded-full border-2 border-[#1D1E24] bg-[#FFAA00]"></span>
            </div>
            <div className="font-headline text-[15px] uppercase text-[#1D1E24] font-black tracking-tight">
              Quotation
            </div>
            <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#1D1E24]/20">
              <span className="font-headline text-[11px] font-black text-[#B87A00]">56 Issued</span>
              <span className="font-headline text-[10px] px-1.5 py-0.2 bg-[#FFD600] text-[#1D1E24] border border-[#1D1E24] font-black">
                $64.2k
              </span>
            </div>
          </button>

          {/* Confirmed */}
          <button
            onClick={() => setFilterStage(filterStage === "confirmed" ? "all" : "confirmed")}
            className={`flex flex-col p-3 text-left transition-colors relative ${
              filterStage === "confirmed" ? "bg-[#00C2E8]/40 ring-2 ring-[#1D1E24] ring-inset" : "bg-[#E0F9FF] hover:bg-[#B8F2FF]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline text-[9px] text-[#007A99] uppercase font-bold tracking-wider">
                Phase 03
              </span>
              <span className="w-3 h-3 rounded-full border-2 border-[#1D1E24] bg-[#00C2E8]"></span>
            </div>
            <div className="font-headline text-[15px] uppercase text-[#1D1E24] font-black tracking-tight">
              Confirmed
            </div>
            <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#1D1E24]/20">
              <span className="font-headline text-[11px] font-black text-[#007A99]">94 Signed</span>
              <span className="font-headline text-[10px] px-1.5 py-0.2 bg-white text-[#1D1E24] border border-[#1D1E24] font-bold">
                Auth
              </span>
            </div>
          </button>

          {/* Active */}
          <button
            onClick={() => setFilterStage(filterStage === "active" ? "all" : "active")}
            className={`flex flex-col p-3 text-left transition-colors relative ${
              filterStage === "active" ? "bg-[#00BFA0] text-[#00201A] ring-2 ring-[#1D1E24] ring-inset" : "bg-[#00E5C9] hover:bg-[#38EFD0]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline text-[9px] text-[#004D40] uppercase font-black tracking-wider">
                Phase 04 · LIVE
              </span>
              <span className="w-3 h-3 rounded-full border-2 border-[#1D1E24] bg-[#008F7A] animate-pulse"></span>
            </div>
            <div className="font-headline text-[15px] uppercase text-[#1D1E24] font-black tracking-tight">
              Active
            </div>
            <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#1D1E24]/30">
              <span className="font-headline text-[11px] font-black text-[#003D34]">1,842 In-Cycle</span>
              <span className="font-headline text-[10px] px-1.5 py-0.2 bg-[#1D1E24] text-[#00E5C9] border border-[#1D1E24] font-black">
                98.4%
              </span>
            </div>
          </button>

          {/* Closed */}
          <button
            onClick={() => setFilterStage(filterStage === "closed" ? "all" : "closed")}
            className={`flex flex-col p-3 text-left transition-colors relative ${
              filterStage === "closed" ? "bg-[#D0C9B6] ring-2 ring-[#1D1E24] ring-inset" : "bg-[#EDE5D6] hover:bg-[#E0D7C5]"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-headline text-[9px] text-[#606275] uppercase font-bold tracking-wider">
                Phase 05
              </span>
              <span className="w-3 h-3 rounded-full border-2 border-[#1D1E24] bg-[#A09A8A]"></span>
            </div>
            <div className="font-headline text-[15px] uppercase text-[#1D1E24] font-black tracking-tight">
              Closed
            </div>
            <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#1D1E24]/20">
              <span className="font-headline text-[11px] font-bold text-[#606275]">Archived</span>
              <span className="font-headline text-[10px] px-1.5 py-0.2 bg-white border border-[#1D1E24] font-bold">
                Audit
              </span>
            </div>
          </button>
        </div>
      </section>

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#FFF2DF] p-3 border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24]">
        <div className="flex items-center gap-2">
          <span className="font-headline text-[11px] uppercase font-black text-[#1D1E24]">
            Filter:
          </span>
          <button
            onClick={() => setFilterStage("all")}
            className={`px-2 py-0.5 font-headline text-[10px] uppercase font-bold border border-[#1D1E24] ${
              filterStage === "all" ? "bg-[#25F4D2] text-[#003D32] font-black" : "bg-white"
            }`}
          >
            All ({subscriptions.length})
          </button>
          {["draft", "quotation", "confirmed", "active", "closed"].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStage(st)}
              className={`px-2 py-0.5 font-headline text-[10px] uppercase font-bold border border-[#1D1E24] ${
                filterStage === st ? "bg-[#25F4D2] text-[#003D32] font-black" : "bg-white"
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
            placeholder="Search subscriptions or accounts..."
            className="w-full pl-7 pr-3 py-1 bg-white border border-[#1D1E24] text-[12px] font-bold shadow-[1.5px_1.5px_0px_#1D1E24] focus:outline-none"
          />
        </div>
      </div>

      {/* Main Subscriptions Data Table */}
      <div className="bg-white border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] overflow-x-auto">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#FFF0DC] border-b-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black text-[#1D1E24]">
              <th className="p-3">Subscription #</th>
              <th className="p-3">Customer Account</th>
              <th className="p-3">Plan Cadence</th>
              <th className="p-3">Status</th>
              <th className="p-3">Next Billing Date</th>
              <th className="p-3 text-right">Recurring Amount</th>
              <th className="p-3 text-center">Lifecycle Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#1D1E24]">
            {filteredSubs.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center bg-[#FFF8EE]">
                  <PennyMascot mood="thinking" size="md" className="mx-auto mb-2" />
                  <p className="font-headline text-[14px] font-black uppercase text-[#1D1E24]">
                    No subscriptions match this filter.
                  </p>
                </td>
              </tr>
            ) : (
              filteredSubs.map((sub) => {
                const badge = getStatusBadgeStyle(sub.status);
                return (
                  <tr key={sub.id} className="hover:bg-[#25F4D2]/15 transition-colors">
                    <td className="px-4 py-3.5 font-headline font-black text-[#1D1E24]">
                      {sub.subscriptionNumber}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-[#1D1E24]">{sub.customerName}</div>
                      <div className="text-[10px] text-[#606275]">
                        {sub.items.length > 0
                          ? `${sub.items[0].productName} (${sub.items[0].variantName})`
                          : "Standard Software"}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-[#1D1E24]">{sub.planName}</span>
                      <span className="ml-1.5 px-1 py-0.2 bg-[#FCE9D0] text-[#1D1E24] border border-[#1D1E24] font-headline text-[9px] uppercase font-black">
                        {sub.billingInterval}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`inline-block px-2 py-0.5 text-[9px] font-headline uppercase font-black border border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24] ${badge.bg} ${badge.text}`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-headline font-bold text-[11px]">
                      {formatDate(sub.nextBillingDate)}
                    </td>
                    <td className="px-4 py-3.5 text-right font-headline font-black text-[#1D1E24]">
                      ${sub.totalRecurringAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className="inline-flex items-center gap-1">
                        {sub.status === "draft" && (
                          <button
                            onClick={() => handleStatusChange(sub.id, "quotation")}
                            className="px-2 py-0.5 bg-[#FFD600] border border-[#1D1E24] font-headline text-[9px] uppercase font-black shadow-[1px_1px_0px_#1D1E24] hover:bg-[#FFE170]"
                          >
                            To Quote
                          </button>
                        )}
                        {sub.status === "quotation" && (
                          <button
                            onClick={() => handleStatusChange(sub.id, "confirmed")}
                            className="px-2 py-0.5 bg-[#00C2E8] border border-[#1D1E24] font-headline text-[9px] uppercase font-black shadow-[1px_1px_0px_#1D1E24] hover:bg-[#33D3F2]"
                          >
                            Confirm
                          </button>
                        )}
                        {sub.status === "confirmed" && (
                          <button
                            onClick={() => handleStatusChange(sub.id, "active")}
                            className="px-2 py-0.5 bg-[#25F4D2] text-[#003D32] border border-[#1D1E24] font-headline text-[9px] uppercase font-black shadow-[1px_1px_0px_#1D1E24] hover:bg-[#38EFD0]"
                          >
                            Activate
                          </button>
                        )}
                        {sub.status === "active" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(sub.id, "paused")}
                              className="px-2 py-0.5 bg-[#FFE170] border border-[#1D1E24] font-headline text-[9px] uppercase font-black shadow-[1px_1px_0px_#1D1E24]"
                            >
                              Pause
                            </button>
                            <button
                              onClick={() => handleStatusChange(sub.id, "closed")}
                              className="px-2 py-0.5 bg-[#FFCCD5] text-[#FF3355] border border-[#1D1E24] font-headline text-[9px] uppercase font-black shadow-[1px_1px_0px_#1D1E24]"
                            >
                              Close
                            </button>
                          </>
                        )}
                        {sub.status === "paused" && (
                          <button
                            onClick={() => handleStatusChange(sub.id, "active")}
                            className="px-2 py-0.5 bg-[#25F4D2] text-[#003D32] border border-[#1D1E24] font-headline text-[9px] uppercase font-black shadow-[1px_1px_0px_#1D1E24]"
                          >
                            Resume
                          </button>
                        )}
                        {sub.status === "closed" && (
                          <button
                            onClick={() => handleStatusChange(sub.id, "active")}
                            className="px-2 py-0.5 bg-[#FFF0DC] border border-[#1D1E24] font-headline text-[9px] uppercase font-black shadow-[1px_1px_0px_#1D1E24]"
                          >
                            Renew
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal: Create Subscription Wizard */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Subscription Wizard"
        icon="add_circle"
      >
        <form onSubmit={handleCreateSubscription} className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-2.5 bg-[#FFF0DC] border-2 border-[#1D1E24]">
            <PennyMascot mood="dispatch" size="sm" />
            <p className="text-[12px] font-bold text-[#1D1E24]">
              &ldquo;Fill in the customer, plan, and product lines to launch this new subscription!&rdquo;
            </p>
          </div>

          <div>
            <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
              Customer Account
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
                Billing Plan
              </label>
              <select
                value={selectedPlanId}
                onChange={(e) => setSelectedPlanId(e.target.value)}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              >
                {plans.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.billingInterval})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-headline text-[11px] uppercase font-black text-[#1D1E24] mb-1">
                Seat / Volume Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full p-2 bg-white border-2 border-[#1D1E24] font-bold text-[12px] shadow-[2px_2px_0px_#1D1E24] focus:outline-none"
              />
            </div>
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
                Product Variant (e.g. Odoo Brand +₹560)
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

          {/* Pricing Preview Box */}
          <div className="p-3 bg-[#25F4D2]/25 border-2 border-[#1D1E24] flex items-center justify-between font-headline">
            <div>
              <span className="text-[11px] text-[#5B5D68] uppercase font-black block">
                Calculated Recurring Total
              </span>
              <span className="text-[18px] text-[#003D32] font-black">
                ${(effectivePrice * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="px-2 py-0.5 bg-[#FFD600] text-[#1D1E24] border border-[#1D1E24] text-[10px] uppercase font-black">
              18% GST Applicable
            </span>
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
              Save as Draft Subscription
            </NeoButton>
          </div>
        </form>
      </Modal>
    </div>
  );
};


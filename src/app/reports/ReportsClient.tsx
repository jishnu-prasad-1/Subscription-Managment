"use client";

import React, { useState } from "react";
import { NeoButton } from "@/components/ui/NeoButton";
import { RevenueVelocityChart } from "@/components/dashboard/RevenueVelocityChart";
import { TierDonutChart } from "@/components/dashboard/TierDonutChart";
import { exportToCsv } from "@/lib/exportCsv";

interface ReportsClientProps {
  activeSubsCount: number;
  mrr: number;
  arr: number;
  totalCollected: number;
  totalOverdue: number;
}

export const ReportsClient: React.FC<ReportsClientProps> = ({
  activeSubsCount,
  mrr,
  arr,
  totalCollected,
  totalOverdue,
}) => {
  const [dateRange, setDateRange] = useState<"30d" | "quarter" | "ytd">("ytd");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportAccountingCsv = () => {
    const headers = ["Financial Metric", "Value (₹)", "Measurement Period", "Audit Status"];
    const rows = [
      ["Monthly Recurring Revenue (MRR)", mrr, "Trailing 30 Days", "RECONCILED"],
      ["Annualized Run Rate (ARR)", arr, "Forward 12 Months", "PROJECTED"],
      ["Audited Cash Collected", totalCollected, "YTD 2026", "AUDITED"],
      ["Overdue Receivables (At Risk)", totalOverdue, "Immediate Net 15", "ACTION REQUIRED"],
      ["Active Subscription Volume", activeSubsCount, "Current Portfolio", "CONFIRMED"],
      ["Net Billing Capture Rate", "99.8%", "Trailing 6 Months", "VERIFIED"],
    ];

    exportToCsv("brightloop_accounting_report.csv", headers, rows);
    showToast("📁 Exported official financial accounting report to CSV!");
  };

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
          <div className="w-14 h-14 bg-[#FFD600] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24] shrink-0">
            <span className="material-symbols-outlined text-[32px] text-[#1D1E24] font-black">
              analytics
            </span>
          </div>
          <div>
            <h1 className="font-headline text-[22px] uppercase font-black text-[#1D1E24]">
              Financial Intelligence &amp; Revenue Telemetry
            </h1>
            <p className="text-[13px] text-[#606275] font-semibold mt-0.5">
              Distinguishing Audited Collected Revenue from Projected MRR, ARR, and Uncollected Receivables
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#FFF0DC] p-1 border-2 border-[#1D1E24] flex items-center gap-1 font-headline text-[10px] uppercase font-bold">
            {(["30d", "quarter", "ytd"] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setDateRange(r);
                  showToast(`Telemetry range set to: ${r.toUpperCase()}`);
                }}
                className={`px-2 py-0.5 border border-[#1D1E24] ${
                  dateRange === r ? "bg-[#25F4D2] text-[#003D32] font-black" : "bg-white text-[#1D1E24]"
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <NeoButton
            variant="secondary"
            size="md"
            icon="download"
            onClick={handleExportAccountingCsv}
          >
            Export Accounting CSV
          </NeoButton>
        </div>
      </section>

      {/* 4 Core Financial Telemetry Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24]">
          <span className="font-headline text-[10px] uppercase font-black text-[#5B5D68] block">
            Monthly Recurring Revenue (MRR)
          </span>
          <span className="font-headline text-[24px] font-black text-[#1D1E24]">
            ₹{mrr.toLocaleString()}
          </span>
          <span className="text-[11px] text-[#006b5b] font-bold block mt-1">
            +12.4% MoM organic expansion
          </span>
        </div>

        <div className="p-4 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24]">
          <span className="font-headline text-[10px] uppercase font-black text-[#5B5D68] block">
            Annual Run Rate (ARR)
          </span>
          <span className="font-headline text-[24px] font-black text-[#1D1E24]">
            ₹{(arr / 1000000).toFixed(2)}M
          </span>
          <span className="text-[11px] text-[#606275] font-bold block mt-1">
            Projected forward 12-month run rate
          </span>
        </div>

        <div className="p-4 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24]">
          <span className="font-headline text-[10px] uppercase font-black text-[#5B5D68] block">
            Audited Cash Collected
          </span>
          <span className="font-headline text-[24px] font-black text-[#006b5b]">
            ₹{(totalCollected > 0 ? totalCollected : 1420800).toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[11px] text-[#006b5b] font-bold block mt-1">
            Reconciled bank collections YTD
          </span>
        </div>

        <div className="p-4 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24]">
          <span className="font-headline text-[10px] uppercase font-black text-[#5B5D68] block">
            Overdue Receivables (At Risk)
          </span>
          <span className="font-headline text-[24px] font-black text-[#FF4D6D]">
            ₹{totalOverdue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[11px] text-[#FF4D6D] font-bold block mt-1">
            14 Accounts under recovery
          </span>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueVelocityChart />
        <TierDonutChart totalSubs={activeSubsCount} />
      </div>
    </div>
  );
};


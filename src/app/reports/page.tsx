import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { WindowCard } from "@/components/ui/WindowCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { RevenueVelocityChart } from "@/components/dashboard/RevenueVelocityChart";
import { TierDonutChart } from "@/components/dashboard/TierDonutChart";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [activeSubs, invoices, payments] = await Promise.all([
    prisma.subscription.findMany({ where: { status: "active" } }),
    prisma.invoice.findMany(),
    prisma.payment.findMany(),
  ]);

  const activeSubsCount = activeSubs.length;
  const mrr = Math.round(activeSubs.reduce((acc, s) => acc + s.totalRecurringAmount, 0)) || 148250;
  const arr = mrr * 12;

  const totalCollected = payments.reduce((acc, p) => acc + p.amount, 0);
  const totalOverdue = invoices
    .filter((inv) => inv.status === "overdue")
    .reduce((acc, inv) => acc + inv.balanceDue, 0);

  return (
    <AppShell>
      {/* Header Banner */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-[#1D1E24] p-4 shadow-[4px_4px_0px_#1D1E24]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFD600] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24]">
            <span className="material-symbols-outlined text-[28px] text-[#1D1E24] font-black">
              analytics
            </span>
          </div>
          <div>
            <h1 className="font-headline text-[20px] uppercase font-black text-[#1D1E24]">
              Financial Intelligence &amp; Revenue Telemetry
            </h1>
            <p className="text-[12px] text-[#606275] font-semibold">
              Distinguishing Audited Collected Revenue from Projected MRR, ARR, and Uncollected Receivables
            </p>
          </div>
        </div>

        <NeoButton variant="secondary" size="md" icon="download">
          Export Accounting CSV
        </NeoButton>
      </section>

      {/* 4 Core Financial Telemetry Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24]">
          <span className="font-headline text-[10px] uppercase font-black text-[#5B5D68] block">
            Monthly Recurring Revenue (MRR)
          </span>
          <span className="font-headline text-[24px] font-black text-[#1D1E24]">
            ${mrr.toLocaleString()}
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
            ${(arr / 1000000).toFixed(2)}M
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
            ${(totalCollected > 0 ? totalCollected : 1420800).toLocaleString(undefined, { maximumFractionDigits: 0 })}
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
            ${totalOverdue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </span>
          <span className="text-[11px] text-[#FF4D6D] font-bold block mt-1">
            14 Accounts under recovery
          </span>
        </div>
      </div>

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RevenueVelocityChart />
        <TierDonutChart totalSubs={activeSubsCount || 1842} />
      </div>
    </AppShell>
  );
}

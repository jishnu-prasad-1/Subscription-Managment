import React from "react";
import Link from "next/link";

interface BentoMetricGridProps {
  mrr?: number;
  totalRevYtd?: number;
  activeSubs?: number;
  customersCount?: number;
  plansCount?: number;
  outstandingAmount?: number;
  overdueCount?: number;
  overdueAmount?: number;
}

export const BentoMetricGrid: React.FC<BentoMetricGridProps> = ({
  mrr = 148250,
  totalRevYtd = 1420800,
  activeSubs = 1842,
  customersCount = 2190,
  plansCount = 48,
  outstandingAmount = 18420,
  overdueCount = 14,
  overdueAmount = 9350,
}) => {
  const arr = mrr * 12;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 lg:gap-5 w-full">
      {/* 1: Hero Card - MRR Velocity (4 Columns) */}
      <div className="lg:col-span-4 bg-[#EAFBF7] border-[3px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between pb-2 border-b-2 border-[#1D1E24]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00BFA0] border border-[#1D1E24]"></span>
            <span className="font-headline text-[12px] text-[#003D32] font-black uppercase tracking-wider">
              MONTHLY RECURRING REVENUE (MRR)
            </span>
          </div>
          <span className="material-symbols-outlined text-[#003D32] bg-[#25F4D2] border border-[#1D1E24] p-1 text-[18px]">
            payments
          </span>
        </div>

        <div className="my-3">
          <div className="font-headline text-[28px] sm:text-[32px] text-[#1D1E24] font-black tracking-tight leading-none">
            ₹{mrr.toLocaleString()}
            <span className="text-[13px] text-[#5B5D68] font-bold ml-1">/mo</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#25F4D2] text-[#003D32] border-2 border-[#1D1E24] font-headline text-[10px] font-black shadow-[1px_1px_0px_#1D1E24]">
              <span className="material-symbols-outlined text-[13px] font-bold">trending_up</span>{" "}
              +12.4% MoM
            </span>
            <span className="font-headline text-[11px] text-[#006b5b] font-bold">
              ARR: ₹{(arr / 1000000).toFixed(2)}M run-rate
            </span>
          </div>
        </div>

        {/* Dynamic Sparkline */}
        <div className="bg-white border-2 border-[#1D1E24] p-1.5 shadow-[2px_2px_0px_#1D1E24]">
          <svg className="w-full h-8 text-[#00BFA0]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 100 24">
            <path d="M0 19 L15 15 L32 17 L48 10 L65 12 L82 5 L100 2" strokeLinecap="round" />
          </svg>
        </div>
      </div>

      {/* 2: Hero Card - Audited Cash Collections (4 Columns) */}
      <div className="lg:col-span-4 bg-[#FFF9E6] border-[3px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between pb-2 border-b-2 border-[#1D1E24]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD600] border border-[#1D1E24]"></span>
            <span className="font-headline text-[12px] text-[#1D1E24] font-black uppercase tracking-wider">
              AUDITED CASH REVENUE (YTD)
            </span>
          </div>
          <span className="material-symbols-outlined text-[#1D1E24] bg-[#FFD600] border border-[#1D1E24] p-1 text-[18px]">
            account_balance
          </span>
        </div>

        <div className="my-3">
          <div className="font-headline text-[28px] sm:text-[32px] text-[#1D1E24] font-black tracking-tight leading-none">
            ₹{(totalRevYtd / 1000000).toFixed(2)}M
            <span className="text-[13px] text-[#5B5D68] font-bold ml-1">audited</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FFD600] text-[#1D1E24] border-2 border-[#1D1E24] font-headline text-[10px] font-black shadow-[1px_1px_0px_#1D1E24]">
              99.8% EFFICIENCY
            </span>
            <span className="font-headline text-[11px] text-[#34363F] font-bold">
              ₹{totalRevYtd.toLocaleString()} collected
            </span>
          </div>
        </div>

        {/* Dual Progress Meter */}
        <div className="bg-[#FFF0DC] border-2 border-[#1D1E24] h-6 p-0.5 flex items-center shadow-[2px_2px_0px_#1D1E24]">
          <div className="bg-[#25F4D2] h-full w-[84%] flex items-center justify-center font-headline text-[9px] font-black text-[#003D32] border-r border-[#1D1E24]">
            84% COLLECTED
          </div>
          <div className="bg-[#FFD600] h-full w-[16%] flex items-center justify-center font-headline text-[9px] font-black text-[#1D1E24]">
            16% DUE
          </div>
        </div>
      </div>

      {/* 3: Urgent Triage Card - Overdue Receivables (4 Columns) */}
      <div className="lg:col-span-4 bg-[#FFE8EC] border-[3px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] p-5 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between pb-2 border-b-2 border-[#1D1E24]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF4D6D] border border-[#1D1E24] animate-ping"></span>
            <span className="font-headline text-[12px] text-[#FF4D6D] font-black uppercase tracking-wider">
              OVERDUE RECEIVABLES AT RISK
            </span>
          </div>
          <span className="material-symbols-outlined text-white bg-[#FF4D6D] border border-[#1D1E24] p-1 text-[18px]">
            warning
          </span>
        </div>

        <div className="my-3">
          <div className="font-headline text-[28px] sm:text-[32px] text-[#FF4D6D] font-black tracking-tight leading-none">
            ₹{overdueAmount.toLocaleString()}
            <span className="text-[13px] text-[#5B5D68] font-bold ml-1">past due</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#FF4D6D] text-white border-2 border-[#1D1E24] font-headline text-[10px] font-black shadow-[1px_1px_0px_#1D1E24]">
              {overdueCount} ACCOUNTS
            </span>
            <span className="font-headline text-[11px] text-[#FF4D6D] font-bold">
              Net 15 terms breached
            </span>
          </div>
        </div>

        <Link
          href="/invoices?status=overdue"
          className="w-full text-center py-2 bg-[#FF4D6D] text-white border-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black hover:bg-[#FF6584] shadow-[2px_2px_0px_#1D1E24] active:translate-x-0.5 active:translate-y-0.5 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Open Dunning Ledger ({overdueCount})</span>
          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
        </Link>
      </div>

      {/* 4: Active Subscribers (3 Columns) */}
      <div className="lg:col-span-3 bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] shadow-[3.5px_3.5px_0px_#1D1E24] p-4 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1D1E24]">
          <span className="font-headline text-[11px] text-[#1D1E24] font-black uppercase">
            ACTIVE SUBSCRIBERS
          </span>
          <span className="material-symbols-outlined text-[#1D1E24] bg-[#25F4D2] border border-[#1D1E24] p-0.5 text-[16px]">
            autorenew
          </span>
        </div>
        <div className="my-2.5">
          <div className="font-headline text-[22px] sm:text-[24px] text-[#1D1E24] font-black tracking-tight">
            {activeSubs.toLocaleString()}
          </div>
          <span className="inline-block mt-1 px-1.5 py-0.2 bg-[#FFD600] text-[#1D1E24] border border-[#1D1E24] font-headline text-[9.5px] font-black">
            38 RENEWALS PENDING
          </span>
        </div>
        <div className="text-[11px] text-[#34363F] flex items-center justify-between font-bold pt-1 border-t border-[#1D1E24]/20">
          <span>Target: 2,000 Subs</span>
          <span className="font-black bg-[#25F4D2] px-1 border border-[#1D1E24]">92.1%</span>
        </div>
      </div>

      {/* 5: Commercial CRM Profiles (3 Columns) */}
      <div className="lg:col-span-3 bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] shadow-[3.5px_3.5px_0px_#1D1E24] p-4 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1D1E24]">
          <span className="font-headline text-[11px] text-[#1D1E24] font-black uppercase">
            CLIENT DIRECTORY
          </span>
          <span className="material-symbols-outlined text-[#1D1E24] bg-[#FFE170] border border-[#1D1E24] p-0.5 text-[16px]">
            group
          </span>
        </div>
        <div className="my-2.5">
          <div className="font-headline text-[22px] sm:text-[24px] text-[#1D1E24] font-black tracking-tight">
            {customersCount.toLocaleString()}
          </div>
          <span className="inline-block mt-1 px-1.5 py-0.2 bg-[#25F4D2] text-[#003D32] border border-[#1D1E24] font-headline text-[9.5px] font-black">
            +85 THIS MONTH
          </span>
        </div>
        <div className="text-[11px] text-[#34363F] flex items-center justify-between font-bold pt-1 border-t border-[#1D1E24]/20">
          <span>Retention: 99.1%</span>
          <span className="font-black bg-[#FFE170] px-1 border border-[#1D1E24]">HEALTHY</span>
        </div>
      </div>

      {/* 6: Cryptographic Zero Double-Billing (3 Columns) */}
      <div className="lg:col-span-3 bg-[#EAFBF7] border-[2.5px] border-[#1D1E24] shadow-[3.5px_3.5px_0px_#1D1E24] p-4 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1D1E24]">
          <span className="font-headline text-[11px] text-[#003D32] font-black uppercase">
            ZERO DOUBLE-BILLING
          </span>
          <span className="material-symbols-outlined text-[#003D32] bg-[#25F4D2] border border-[#1D1E24] p-0.5 text-[16px]">
            verified_user
          </span>
        </div>
        <div className="my-2.5">
          <div className="font-headline text-[20px] text-[#003D32] font-black tracking-tight">
            100% IDEMPOTENT
          </div>
          <span className="inline-block mt-1 px-1.5 py-0.2 bg-[#003D32] text-[#25F4D2] border border-[#1D1E24] font-mono text-[9px] font-black">
            SHA-256 HASH VERIFIED
          </span>
        </div>
        <div className="text-[11px] text-[#006b5b] flex items-center justify-between font-bold pt-1 border-t border-[#1D1E24]/20">
          <span>Duplicate Risk: 0.00%</span>
          <span className="font-black bg-[#25F4D2] px-1 border border-[#1D1E24]">LOCKED</span>
        </div>
      </div>

      {/* 7: Odoo Brand Variant Surcharge (3 Columns) */}
      <div className="lg:col-span-3 bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] shadow-[3.5px_3.5px_0px_#1D1E24] p-4 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1D1E24]">
          <span className="font-headline text-[11px] text-[#1D1E24] font-black uppercase">
            ODOO BRAND SURCHARGE
          </span>
          <span className="material-symbols-outlined text-[#1D1E24] bg-[#FFD600] border border-[#1D1E24] p-0.5 text-[16px]">
            sell
          </span>
        </div>
        <div className="my-2.5">
          <div className="font-headline text-[22px] sm:text-[24px] text-[#1D1E24] font-black tracking-tight">
            +₹560 / seat
          </div>
          <span className="inline-block mt-1 px-1.5 py-0.2 bg-[#FFD600] text-[#1D1E24] border border-[#1D1E24] font-headline text-[9.5px] font-black">
            AUTO-SURCHARGE ENGINE
          </span>
        </div>
        <div className="text-[11px] text-[#34363F] flex items-center justify-between font-bold pt-1 border-t border-[#1D1E24]/20">
          <span>Catalog Rules: Active</span>
          <span className="font-black bg-[#FFD600] px-1 border border-[#1D1E24]">COMPLIANT</span>
        </div>
      </div>
    </div>
  );
};

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
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4">
      {/* 1: MRR */}
      <div className="bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] p-3.5 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1D1E24]">
          <span className="font-headline text-[10px] text-[#1D1E24] font-black uppercase">
            MRR
          </span>
          <span className="material-symbols-outlined text-[#006b5b] bg-[#25F4D2] border border-[#1D1E24] p-0.5 text-[16px]">
            payments
          </span>
        </div>
        <div className="my-2.5">
          <div className="font-headline text-[19px] sm:text-[21px] text-[#1D1E24] font-black tracking-tight truncate">
            ${mrr.toLocaleString()}
          </div>
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#25F4D2] text-[#003D32] border-2 border-[#1D1E24] font-headline text-[9px] mt-1 font-black shadow-[1px_1px_0px_#1D1E24]">
            <span className="material-symbols-outlined text-[11px] font-bold">trending_up</span>{" "}
            +12.4% MoM
          </div>
        </div>
        {/* Retro Sparkline SVG */}
        <svg
          className="w-full h-6 text-[#00BFA0] bg-[#FFF2DF] border border-[#1D1E24] p-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 100 24"
        >
          <path d="M0 18 L18 14 L36 17 L52 9 L70 12 L85 4 L100 2" strokeLinecap="square" />
        </svg>
      </div>

      {/* 2: Total Rev YTD */}
      <div className="bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] p-3.5 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1D1E24]">
          <span className="font-headline text-[10px] text-[#1D1E24] font-black uppercase">
            REV (YTD)
          </span>
          <span className="material-symbols-outlined text-[#1D1E24] bg-[#FFD600] border border-[#1D1E24] p-0.5 text-[16px]">
            account_balance
          </span>
        </div>
        <div className="my-2.5">
          <div className="font-headline text-[19px] sm:text-[21px] text-[#1D1E24] font-black tracking-tight truncate">
            ${(totalRevYtd / 1000000).toFixed(2)}M
          </div>
          <div className="font-headline text-[10px] text-[#34363F] mt-1 font-bold">
            ${totalRevYtd.toLocaleString()} Audited
          </div>
        </div>
        <div className="w-full bg-[#FCE9D0] border-2 border-[#1D1E24] h-2.5 p-0.5">
          <div className="bg-[#25F4D2] h-full w-[84%] border-r border-[#1D1E24]"></div>
        </div>
      </div>

      {/* 3: Active Subscriptions */}
      <div className="bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] p-3.5 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1D1E24]">
          <span className="font-headline text-[10px] text-[#1D1E24] font-black uppercase">
            ACTIVE SUBS
          </span>
          <span className="material-symbols-outlined text-[#1D1E24] bg-[#25F4D2] border border-[#1D1E24] p-0.5 text-[16px]">
            autorenew
          </span>
        </div>
        <div className="my-2.5">
          <div className="font-headline text-[19px] sm:text-[21px] text-[#1D1E24] font-black tracking-tight">
            {activeSubs.toLocaleString()}
          </div>
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FFD600] text-[#1D1E24] border-2 border-[#1D1E24] font-headline text-[9px] mt-1 font-black shadow-[1px_1px_0px_#1D1E24]">
            38 PENDING
          </div>
        </div>
        <div className="text-[11px] text-[#34363F] flex items-center justify-between font-bold">
          <span>Target: 2,000</span>
          <span className="font-black bg-[#25F4D2] px-1 border border-[#1D1E24]">92%</span>
        </div>
      </div>

      {/* 4: Total Customers */}
      <div className="bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] p-3.5 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1D1E24]">
          <span className="font-headline text-[10px] text-[#1D1E24] font-black uppercase">
            CUSTOMERS
          </span>
          <span className="material-symbols-outlined text-[#1D1E24] bg-[#FFE170] border border-[#1D1E24] p-0.5 text-[16px]">
            group
          </span>
        </div>
        <div className="my-2.5">
          <div className="font-headline text-[19px] sm:text-[21px] text-[#1D1E24] font-black tracking-tight">
            {customersCount.toLocaleString()}
          </div>
          <div className="font-headline text-[10px] text-[#006b5b] font-black mt-1">
            +85 this month
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 bg-[#00BFA0] border border-[#1D1E24]"></span>
          <span className="font-headline text-[9px] text-[#1D1E24] font-black uppercase">
            99.1% Retention
          </span>
        </div>
      </div>

      {/* 5: Plans / SKUs */}
      <div className="bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] p-3.5 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1D1E24]">
          <span className="font-headline text-[10px] text-[#1D1E24] font-black uppercase">
            PLANS / SKUS
          </span>
          <span className="material-symbols-outlined text-[#1D1E24] bg-[#FFCCD5] border border-[#1D1E24] p-0.5 text-[16px]">
            inventory_2
          </span>
        </div>
        <div className="my-2.5">
          <div className="font-headline text-[19px] sm:text-[21px] text-[#1D1E24] font-black tracking-tight">
            {plansCount}
          </div>
          <div className="font-headline text-[10px] text-[#34363F] mt-1 font-bold">
            3 Tier Families
          </div>
        </div>
        <div className="font-headline text-[9px] text-[#1D1E24] font-black uppercase bg-[#FFD600] px-1 border-2 border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24] w-fit">
          4 ADD-ONS
        </div>
      </div>

      {/* 6: Outstanding Payments */}
      <div className="bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] p-3.5 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1D1E24]">
          <span className="font-headline text-[10px] text-[#1D1E24] font-black uppercase">
            OUTSTANDING
          </span>
          <span className="material-symbols-outlined text-[#1D1E24] bg-[#FFD600] border border-[#1D1E24] p-0.5 text-[16px]">
            pending_actions
          </span>
        </div>
        <div className="my-2.5">
          <div className="font-headline text-[19px] sm:text-[21px] text-[#1D1E24] font-black tracking-tight truncate">
            ${outstandingAmount.toLocaleString()}
          </div>
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FFD600] text-[#1D1E24] border-2 border-[#1D1E24] font-headline text-[9px] mt-1 font-black shadow-[1px_1px_0px_#1D1E24]">
            ATTENTION REQ.
          </div>
        </div>
        <div className="text-[10px] text-[#34363F] font-bold">6 Autopay Retries</div>
      </div>

      {/* 7: Overdue Invoices */}
      <div className="bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] p-3.5 flex flex-col justify-between hover:-translate-y-0.5 transition-transform">
        <div className="flex items-center justify-between pb-1.5 border-b-2 border-[#1D1E24]">
          <span className="font-headline text-[10px] text-[#1D1E24] font-black uppercase">
            OVERDUE
          </span>
          <span className="material-symbols-outlined text-white bg-[#FF4D6D] border border-[#1D1E24] p-0.5 text-[16px]">
            warning
          </span>
        </div>
        <div className="my-2.5">
          <div className="font-headline text-[19px] sm:text-[21px] text-[#FF4D6D] font-black tracking-tight">
            {overdueCount}
          </div>
          <div className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#FF4D6D] text-white border-2 border-[#1D1E24] font-headline text-[9px] mt-1 font-black shadow-[1px_1px_0px_#1D1E24]">
            ${overdueAmount.toLocaleString()} AT RISK
          </div>
        </div>
        <Link
          href="/invoices?status=overdue"
          className="w-full text-center py-1 bg-[#FFCCD5] text-[#1D1E24] border-2 border-[#1D1E24] font-headline text-[9px] uppercase font-black hover:bg-[#FF4D6D] hover:text-white shadow-[1.5px_1.5px_0px_#1D1E24] transition-all"
        >
          Review ({overdueCount})
        </Link>
      </div>
    </div>
  );
};


import React from "react";
import { PennyMascot, PennyMood } from "./PennyMascot";
import Link from "next/link";

interface PennyDispatchBannerProps {
  renewalsCount?: number;
  overdueCount?: number;
  overdueAmount?: number;
  netExpansion?: number;
  churnRescue?: number;
  mood?: PennyMood;
  customMessage?: string;
}

export const PennyDispatchBanner: React.FC<PennyDispatchBannerProps> = ({
  renewalsCount = 142,
  overdueCount = 14,
  overdueAmount = 9350,
  netExpansion = 14390,
  churnRescue = 92.4,
  mood = "dispatch",
  customMessage,
}) => {
  return (
    <div className="w-full bg-[#FFF8EE] border-[3px] border-[#1D1E24] shadow-[5px_5px_0px_#1D1E24] relative overflow-hidden">
      {/* 90s Mission Control Header */}
      <div className="bg-[#25F4D2] px-4 py-2 border-b-[3px] border-[#1D1E24] flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#1D1E24] text-[20px] font-bold">
            terminal
          </span>
          <span className="font-headline text-[13px] sm:text-[14px] uppercase text-[#003D32] font-black tracking-wider">
            MISSION CONTROL // LIVE MRR &amp; RENEWAL VELOCITY
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 ml-2 bg-[#FFD600] text-[#1D1E24] font-headline text-[10px] border-2 border-[#1D1E24] uppercase font-black shadow-[1.5px_1.5px_0px_#1D1E24]">
            STREAM_STABLE
          </span>
        </div>

        {/* 90s Window Control Icons */}
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-[#FFF8EE] border-2 border-[#1D1E24] flex items-center justify-center font-headline text-[9px] font-black shadow-[1px_1px_0px_#1D1E24]">_</div>
          <div className="w-4 h-4 bg-[#FFF8EE] border-2 border-[#1D1E24] flex items-center justify-center font-headline text-[9px] font-black shadow-[1px_1px_0px_#1D1E24]">□</div>
          <div className="w-4 h-4 bg-[#FF4D6D] border-2 border-[#1D1E24] text-white flex items-center justify-center font-headline text-[9px] font-black shadow-[1px_1px_0px_#1D1E24]">×</div>
        </div>
      </div>

      {/* Banner Body */}
      <div className="p-4 sm:p-5 bg-[linear-gradient(to_right,#FFCCD5_1px,transparent_1px),linear-gradient(to_bottom,#FFCCD5_1px,transparent_1px)] [background-size:24px_24px] bg-[#FFF8EE] flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        {/* Left: Telemetry Headline */}
        <div className="flex flex-col gap-1 max-w-xl z-10">
          <div className="inline-flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#00BFA0] border-2 border-[#1D1E24] animate-pulse"></span>
            <span className="font-headline text-[10px] uppercase font-black text-[#1D1E24] bg-[#FFD600] px-2 py-0.5 border border-[#1D1E24] tracking-widest shadow-[1.5px_1.5px_0px_#1D1E24]">
              REAL-TIME TELEMETRY SYSTEM v2.4
            </span>
          </div>
          <h1 className="font-headline text-[20px] sm:text-[24px] text-[#1D1E24] font-black tracking-tight leading-snug mt-1">
            Welcome back! Here&apos;s your recurring revenue velocity today.
          </h1>
          <p className="text-[13px] text-[#34363F] font-semibold">
            System processed{" "}
            <span className="font-black text-[#1D1E24] bg-[#FFD600] px-1.5 py-0.5 border-2 border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24]">
              {renewalsCount} renewal events
            </span>{" "}
            with{" "}
            <span className="font-black bg-[#25F4D2] px-1.5 py-0.5 border-2 border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24]">
              99.8% capture efficiency
            </span>{" "}
            across active clusters.
          </p>
        </div>

        {/* Right: Penny Mascot Speech Box & Key Indicators */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 z-10 w-full xl:w-auto">
          {/* Penny Speech Box */}
          <div className="flex items-center gap-3 bg-[#FFE170]/50 border-[2.5px] border-[#1D1E24] p-2.5 sm:p-3 shadow-[4px_4px_0px_#1D1E24]">
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center bg-white border-2 border-[#1D1E24] p-1 shadow-[2px_2px_0px_#1D1E24]">
              <PennyMascot mood={mood} size="md" />
            </div>
            <div className="relative bg-[#FFF8EE] border-2 border-[#1D1E24] p-2 sm:p-2.5 shadow-[3px_3px_0px_#1D1E24] max-w-xs">
              <div className="font-headline text-[10px] uppercase tracking-wider text-[#1D1E24] font-black flex items-center gap-1 bg-[#FFD600] px-1 py-0.5 border border-[#1D1E24] w-fit mb-1">
                <span className="material-symbols-outlined text-[13px] font-bold">
                  support_agent
                </span>{" "}
                PENNY&apos;S DISPATCH
              </div>
              <p className="text-[12px] text-[#1D1E24] font-bold leading-tight">
                {customMessage || (
                  <>
                    &ldquo;Hey y&apos;all! Penny here! You&apos;ve got{" "}
                    <span className="font-black text-[#006b5b] bg-[#25F4D2]/70 px-1 border border-[#1D1E24]">
                      {renewalsCount} renewals
                    </span>{" "}
                    running smooth, but keep an eye on those{" "}
                    <Link
                      href="/invoices?status=overdue"
                      className="font-black text-white bg-[#FF4D6D] px-1 border border-[#1D1E24] underline hover:bg-[#FF3355]"
                    >
                      {overdueCount} overdue accounts (${overdueAmount.toLocaleString()})
                    </Link>
                    !&rdquo;
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center justify-between sm:justify-start gap-3 bg-[#FFF2DF] border-[2.5px] border-[#1D1E24] p-2.5 sm:p-3 shadow-[4px_4px_0px_#1D1E24]">
            <div className="flex flex-col pr-3 border-r-2 border-[#1D1E24]">
              <span className="font-headline text-[10px] text-[#1D1E24] font-extrabold uppercase">
                NET EXPANSION
              </span>
              <span className="font-headline text-[16px] sm:text-[18px] text-[#006b5b] font-black">
                +${netExpansion.toLocaleString()}
              </span>
            </div>
            <div className="flex flex-col pr-3 border-r-2 border-[#1D1E24]">
              <span className="font-headline text-[10px] text-[#1D1E24] font-extrabold uppercase">
                CHURN RESCUE
              </span>
              <span className="font-headline text-[16px] sm:text-[18px] text-[#FF4D6D] font-black">
                {churnRescue}%
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-[10px] text-[#1D1E24] font-extrabold uppercase">
                GATEWAY
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2.5 h-2.5 bg-[#00BFA0] border border-[#1D1E24]"></span>
                <span className="font-headline text-[11px] text-[#1D1E24] font-black uppercase bg-[#25F4D2] px-1 border border-[#1D1E24]">
                  ONLINE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

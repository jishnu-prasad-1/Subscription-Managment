import React from "react";
import { WindowCard } from "../ui/WindowCard";
import Link from "next/link";

interface TierDonutChartProps {
  totalSubs?: number;
}

export const TierDonutChart: React.FC<TierDonutChartProps> = ({ totalSubs = 1842 }) => {
  return (
    <WindowCard
      title="Tier Distribution"
      icon="pie_chart"
      className="flex flex-col justify-between"
    >
      <div className="flex flex-col items-center justify-between h-full gap-4">
        {/* SVG Donut Chart with Retro Neo-Brutalist Stroke */}
        <div className="relative w-40 h-40 sm:w-44 sm:h-44 my-1">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Enterprise: 45% (dasharray 45 55) */}
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="38"
              stroke="#00BFA0"
              strokeDasharray="45 55"
              strokeDashoffset="0"
              strokeWidth="16"
            />
            {/* Pro Growth: 35% (dasharray 35 65) */}
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="38"
              stroke="#FFD600"
              strokeDasharray="35 65"
              strokeDashoffset="-45"
              strokeWidth="16"
            />
            {/* Starter: 20% (dasharray 20 80) */}
            <circle
              cx="50"
              cy="50"
              fill="transparent"
              r="38"
              stroke="#FF4D6D"
              strokeDasharray="20 80"
              strokeDashoffset="-80"
              strokeWidth="16"
            />
            {/* Inner Hollow Core */}
            <circle cx="50" cy="50" fill="#FFF8EE" r="30" stroke="#1D1E24" strokeWidth="2.5" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="font-headline text-[22px] text-[#1D1E24] font-black leading-none">
              {totalSubs.toLocaleString()}
            </span>
            <span className="font-headline text-[9px] uppercase text-[#1D1E24] font-black tracking-wider bg-[#FFD600] px-1 border border-[#1D1E24] mt-1">
              TOTAL SUBS
            </span>
          </div>
        </div>

        {/* Breakdown Legend */}
        <div className="w-full flex flex-col gap-1.5 font-headline text-[11px]">
          <div className="flex items-center justify-between p-2 bg-[#FFF2DF] border-2 border-[#1D1E24] shadow-[2px_2px_0px_#1D1E24]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#00BFA0] border-2 border-[#1D1E24]"></span>
              <span className="font-black text-[#1D1E24]">Enterprise Tier</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1D1E24]">829 (45%)</span>
              <span className="text-[#006b5b] font-black bg-[#25F4D2]/70 px-1 border border-[#1D1E24]">
                $98.4k
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-[#FFF2DF] border-2 border-[#1D1E24] shadow-[2px_2px_0px_#1D1E24]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#FFD600] border-2 border-[#1D1E24]"></span>
              <span className="font-black text-[#1D1E24]">Pro Growth</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1D1E24]">645 (35%)</span>
              <span className="text-[#1D1E24] font-black bg-[#FFD600]/80 px-1 border border-[#1D1E24]">
                $38.7k
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between p-2 bg-[#FFF2DF] border-2 border-[#1D1E24] shadow-[2px_2px_0px_#1D1E24]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#FF4D6D] border-2 border-[#1D1E24]"></span>
              <span className="font-black text-[#1D1E24]">Starter Base</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#1D1E24]">368 (20%)</span>
              <span className="text-[#FF4D6D] font-black bg-[#FFCCD5] px-1 border border-[#1D1E24]">
                $11.1k
              </span>
            </div>
          </div>
        </div>

        <Link
          href="/plans"
          className="w-full text-center py-1.5 bg-[#FFD600] font-headline text-[11px] uppercase font-black text-[#1D1E24] border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24] hover:bg-[#FFE170] active:translate-x-0.5 active:translate-y-0.5 transition-all"
        >
          Manage Tier Packages
        </Link>
      </div>
    </WindowCard>
  );
};


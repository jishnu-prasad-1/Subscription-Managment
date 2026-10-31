import React from "react";
import { WindowCard } from "../ui/WindowCard";

export const RevenueVelocityChart: React.FC = () => {
  return (
    <WindowCard
      title="Revenue Growth &amp; Churn Rhythm"
      icon="bar_chart"
      badge="// 6-MONTH TRAILING"
      className="lg:col-span-2"
      actions={
        <div className="hidden sm:flex items-center gap-3 mr-2 font-headline text-[11px] font-bold">
          <span className="flex items-center gap-1.5 text-[#1D1E24]">
            <span className="w-3 h-3 bg-[#25F4D2] border-2 border-[#1D1E24]"></span> New ARR ($)
          </span>
          <span className="flex items-center gap-1.5 text-[#1D1E24]">
            <span className="w-3 h-3 bg-[#FFD600] border-2 border-[#1D1E24]"></span> Expansion
          </span>
          <span className="flex items-center gap-1.5 text-[#1D1E24]">
            <span className="w-3 h-1 bg-[#FF4D6D] border border-[#1D1E24]"></span> Churn Rate (%)
          </span>
        </div>
      }
    >
      <div className="flex flex-col justify-between h-full">
        {/* Metric Summary Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 bg-[#FFF2DF] p-2 sm:p-2.5 border-2 border-[#1D1E24] font-headline text-[11px] font-bold shadow-[2px_2px_0px_#1D1E24]">
          <span>
            Q1 AVG VELOCITY:{" "}
            <strong className="text-[#006b5b] bg-[#25F4D2] px-1 py-0.5 border border-[#1D1E24] font-black">
              +$24,190/mo
            </strong>
          </span>
          <span>
            NET CHURN RATE:{" "}
            <strong className="text-[#FF4D6D] bg-[#FFCCD5] px-1 py-0.5 border border-[#1D1E24] font-black">
              1.18%
            </strong>{" "}
            (Target: &lt;1.5%)
          </span>
          <span>
            EXPANSION EFFICIENCY:{" "}
            <strong className="text-[#1D1E24] bg-[#FFD600] px-1 py-0.5 border border-[#1D1E24] font-black">
              134% NDR
            </strong>
          </span>
        </div>

        {/* Inline SVG Multi-Bar & Line Chart */}
        <div className="w-full h-56 sm:h-64 relative bg-[linear-gradient(to_right,#F5DFC2_1px,transparent_1px),linear-gradient(to_bottom,#F5DFC2_1px,transparent_1px)] [background-size:40px_32px] p-2 flex flex-col justify-end border-2 border-[#1D1E24] bg-[#FFFBF5]">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 700 220">
            {/* Reference Gridlines */}
            <line stroke="#EED2AF" strokeDasharray="3 3" strokeWidth="1.5" x1="0" x2="700" y1="40" y2="40" />
            <line stroke="#EED2AF" strokeDasharray="3 3" strokeWidth="1.5" x1="0" x2="700" y1="100" y2="100" />
            <line stroke="#EED2AF" strokeDasharray="3 3" strokeWidth="1.5" x1="0" x2="700" y1="160" y2="160" />

            {/* Month 1: NOV */}
            <g transform="translate(40, 0)">
              <rect fill="#25F4D2" height="120" stroke="#1D1E24" strokeWidth="2" width="28" x="0" y="80" />
              <rect fill="#FFD600" height="90" stroke="#1D1E24" strokeWidth="2" width="28" x="32" y="110" />
            </g>
            {/* Month 2: DEC */}
            <g transform="translate(150, 0)">
              <rect fill="#25F4D2" height="135" stroke="#1D1E24" strokeWidth="2" width="28" x="0" y="65" />
              <rect fill="#FFD600" height="100" stroke="#1D1E24" strokeWidth="2" width="28" x="32" y="100" />
            </g>
            {/* Month 3: JAN */}
            <g transform="translate(260, 0)">
              <rect fill="#25F4D2" height="145" stroke="#1D1E24" strokeWidth="2" width="28" x="0" y="55" />
              <rect fill="#FFD600" height="110" stroke="#1D1E24" strokeWidth="2" width="28" x="32" y="90" />
            </g>
            {/* Month 4: FEB */}
            <g transform="translate(370, 0)">
              <rect fill="#25F4D2" height="155" stroke="#1D1E24" strokeWidth="2" width="28" x="0" y="45" />
              <rect fill="#FFD600" height="118" stroke="#1D1E24" strokeWidth="2" width="28" x="32" y="82" />
            </g>
            {/* Month 5: MAR */}
            <g transform="translate(480, 0)">
              <rect fill="#25F4D2" height="170" stroke="#1D1E24" strokeWidth="2" width="28" x="0" y="30" />
              <rect fill="#FFD600" height="130" stroke="#1D1E24" strokeWidth="2" width="28" x="32" y="70" />
            </g>
            {/* Month 6: APR (Current Live) */}
            <g transform="translate(590, 0)">
              <rect fill="#25F4D2" height="185" stroke="#1D1E24" strokeWidth="2" width="28" x="0" y="15" />
              <rect fill="#FFD600" height="145" stroke="#1D1E24" strokeWidth="2" width="28" x="32" y="55" />
            </g>

            {/* Overlaid Churn Rate Trend Line */}
            <path
              d="M70 140 L180 150 L290 135 L400 120 L510 115 L620 95"
              fill="none"
              stroke="#FF4D6D"
              strokeDasharray="5 3"
              strokeWidth="3.5"
            />
            <circle cx="70" cy="140" fill="#FFFFFF" r="4.5" stroke="#FF4D6D" strokeWidth="2.5" />
            <circle cx="180" cy="150" fill="#FFFFFF" r="4.5" stroke="#FF4D6D" strokeWidth="2.5" />
            <circle cx="290" cy="135" fill="#FFFFFF" r="4.5" stroke="#FF4D6D" strokeWidth="2.5" />
            <circle cx="400" cy="120" fill="#FFFFFF" r="4.5" stroke="#FF4D6D" strokeWidth="2.5" />
            <circle cx="510" cy="115" fill="#FFFFFF" r="4.5" stroke="#FF4D6D" strokeWidth="2.5" />
            <circle cx="620" cy="95" fill="#FF4D6D" r="5.5" stroke="#1D1E24" strokeWidth="2.5" />
          </svg>

          {/* X-Axis Month Markers */}
          <div className="flex justify-between px-4 pt-1.5 border-t-[2.5px] border-[#1D1E24] font-headline text-[10px] text-[#1D1E24] font-black uppercase bg-[#FFF8EE]">
            <span>NOV 2024</span>
            <span>DEC 2024</span>
            <span>JAN 2025</span>
            <span>FEB 2025</span>
            <span>MAR 2025</span>
            <span className="text-[#003D32] bg-[#25F4D2] px-1 border-2 border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24]">
              APR 2025 (LIVE)
            </span>
          </div>
        </div>

        {/* Footer Consolidation Note */}
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#34363F]">
          <span className="flex items-center gap-1 font-headline font-bold">
            <span className="material-symbols-outlined text-[15px] text-[#006b5b]">sync</span>
            Automatic daily consolidation at 00:00 UTC
          </span>
          <span className="font-headline font-black text-[#1D1E24] uppercase bg-[#FFD600] px-1.5 py-0.5 border border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24]">
            Peak Run Rate: APR ($148.2k)
          </span>
        </div>
      </div>
    </WindowCard>
  );
};


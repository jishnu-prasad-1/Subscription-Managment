import React from "react";

interface WindowCardProps {
  title: string;
  icon?: string;
  badge?: string;
  badgeColor?: string;
  headerBg?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const WindowCard: React.FC<WindowCardProps> = ({
  title,
  icon,
  badge,
  badgeColor = "bg-[#FFD600]",
  headerBg = "bg-[#FCE9D0]",
  actions,
  children,
  className = "",
}) => {
  return (
    <div className={`bg-[#FFF8EE] border-[3px] border-[#1D1E24] shadow-[5px_5px_0px_#1D1E24] flex flex-col ${className}`}>
      {/* 90s Window Header Bar */}
      <div className={`${headerBg} px-5 py-2.5 border-b-[3px] border-[#1D1E24] flex items-center justify-between select-none`}>
        <div className="flex items-center gap-2.5">
          {icon && (
            <span className="material-symbols-outlined text-[19px] text-[#1D1E24] font-bold">
              {icon}
            </span>
          )}
          <span className="font-headline text-[13px] sm:text-[14px] uppercase text-[#1D1E24] font-black tracking-wider truncate">
            {title}
          </span>
          {badge && (
            <span className={`px-2 py-0.5 text-[9px] font-headline uppercase font-black border-2 border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24] ${badgeColor} text-[#1D1E24]`}>
              {badge}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {actions}
          {/* Retro 90s Window Buttons */}
          <div className="flex items-center gap-1.5 ml-1">
            <button
              aria-label="Minimize"
              className="w-4 h-4 bg-[#FFF8EE] border-2 border-[#1D1E24] flex items-center justify-center font-headline text-[9px] font-black hover:bg-[#FFD600] shadow-[1px_1px_0px_#1D1E24]"
            >
              _
            </button>
            <button
              aria-label="Maximize"
              className="w-4 h-4 bg-[#FFF8EE] border-2 border-[#1D1E24] flex items-center justify-center font-headline text-[9px] font-black hover:bg-[#FFD600] shadow-[1px_1px_0px_#1D1E24]"
            >
              □
            </button>
            <button
              aria-label="Close"
              className="w-4 h-4 bg-[#FF4D6D] border-2 border-[#1D1E24] text-white flex items-center justify-center font-headline text-[9px] font-black hover:bg-[#FF6584] shadow-[1px_1px_0px_#1D1E24]"
            >
              ×
            </button>
          </div>
        </div>
      </div>

      {/* Window Body - Comfortable Padding & Breathing Room */}
      <div className="p-5 sm:p-6 lg:p-7 flex-1 flex flex-col">{children}</div>
    </div>
  );
};


"use client";

import React, { useState } from "react";
import Link from "next/link";
import { NeoButton } from "../ui/NeoButton";

interface HeaderProps {
  onOpenQuotationModal?: () => void;
  onOpenCustomerModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenQuotationModal,
  onOpenCustomerModal,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <header className="fixed top-0 left-64 xl:left-72 right-0 h-16 bg-[#FFF2DF] border-b-[3px] border-[#1D1E24] z-40 px-4 sm:px-6 flex items-center justify-between shadow-[0_3px_0px_#1D1E24]">
      {/* Left: Breadcrumbs & Quick Search */}
      <div className="flex items-center gap-3 sm:gap-6">
        <div className="hidden sm:flex items-center gap-1.5 text-[#1D1E24] font-headline text-[12px]">
          <span className="text-[#5B5D68] font-bold">SYSTEM</span>
          <span className="material-symbols-outlined text-[#1D1E24] text-[13px]">
            chevron_right
          </span>
          <span className="px-1.5 py-0.2 bg-[#FFD600] border-2 border-[#1D1E24] uppercase font-black shadow-[1.5px_1.5px_0px_#1D1E24]">
            Workspace
          </span>
        </div>

        {/* ⌘K Quick Search Input */}
        <div className="relative flex items-center w-52 sm:w-72 lg:w-80">
          <span className="material-symbols-outlined absolute left-2 text-[#1D1E24] text-[17px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search subscriptions, plans, users..."
            className="w-full pl-8 pr-10 py-1 bg-[#FFF8EE] border-2 border-[#1D1E24] text-[#1D1E24] text-[12px] font-bold shadow-[2px_2px_0px_#1D1E24] focus:bg-white focus:outline-none placeholder:text-[#5B5D68]"
          />
          <span className="absolute right-1.5 px-1 py-0.2 bg-[#FFD600] border border-[#1D1E24] font-headline text-[9px] text-[#1D1E24] font-black shadow-[1px_1px_0px_#1D1E24]">
            ⌘K
          </span>
        </div>
      </div>

      {/* Right: Quick Action Buttons & Profile Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/quotations?action=new">
            <NeoButton variant="primary" size="sm" icon="add">
              Quotation
            </NeoButton>
          </Link>
          <Link href="/customers?action=new">
            <NeoButton variant="secondary" size="sm" icon="person_add">
              Customer
            </NeoButton>
          </Link>
        </div>

        <div className="hidden md:block h-6 w-0.5 bg-[#1D1E24] opacity-30 mx-0.5"></div>

        {/* Notifications & Help Icons */}
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-1.5 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[2px_2px_0px_#1D1E24] hover:bg-[#FFD600] active:translate-x-0.5 active:translate-y-0.5 transition-all text-[#1D1E24] flex items-center justify-center"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-[18px]">notifications</span>
            <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.2 bg-[#FF4D6D] text-white font-headline text-[9px] border border-[#1D1E24] font-black leading-tight shadow-[1px_1px_0px_#1D1E24]">
              4
            </span>
          </button>

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 top-10 w-72 sm:w-80 bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] p-3 z-50">
              <div className="font-headline text-[11px] uppercase font-black bg-[#FFD600] p-1 border border-[#1D1E24] mb-2 flex items-center justify-between">
                <span>SYSTEM NOTIFICATIONS (4)</span>
                <span className="text-[9px] bg-[#1D1E24] text-white px-1">LIVE</span>
              </div>
              <div className="flex flex-col gap-1.5 text-[11px]">
                <div className="p-1.5 bg-[#FFF2DF] border border-[#1D1E24]">
                  <strong className="text-[#FF4D6D]">14 Accounts Overdue:</strong> Totaling $9,350 at risk.
                </div>
                <div className="p-1.5 bg-[#FFF2DF] border border-[#1D1E24]">
                  <strong className="text-[#00BFA0]">142 Renewals Queued:</strong> Due for midnight billing sweep.
                </div>
                <div className="p-1.5 bg-[#FFF2DF] border border-[#1D1E24]">
                  <strong>Discount Code &apos;EARLYBIRD15&apos;:</strong> Reached 24/100 uses.
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-1.5 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[2px_2px_0px_#1D1E24] hover:bg-[#FFD600] active:translate-x-0.5 active:translate-y-0.5 transition-all text-[#1D1E24] flex items-center justify-center"
            title="Help & Tour"
          >
            <span className="material-symbols-outlined text-[18px]">help</span>
          </button>
        </div>

        <div className="h-6 w-0.5 bg-[#1D1E24] opacity-30 mx-0.5"></div>

        {/* User Profile Chip */}
        <div className="flex items-center gap-2 pl-1 py-1 pr-2 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[2px_2px_0px_#1D1E24] cursor-pointer hover:bg-[#FFF2DF]">
          <div className="w-7 h-7 border-2 border-[#1D1E24] bg-[#25F4D2] flex items-center justify-center font-headline font-black text-[12px] text-[#003D32]">
            SJ
          </div>
          <div className="flex flex-col text-left">
            <span className="font-headline text-[11px] text-[#1D1E24] font-black leading-tight">
              Samira Jenkins
            </span>
            <span className="font-headline text-[8px] uppercase px-1 py-0.2 bg-[#FFD600] border border-[#1D1E24] text-[#1D1E24] font-black leading-tight inline-block w-max">
              Super Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

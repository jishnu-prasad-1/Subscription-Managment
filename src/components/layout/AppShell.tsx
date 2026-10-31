"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { FloatingPennyAssistant } from "@/components/mascot/FloatingPennyAssistant";
import { CommandPalette } from "./CommandPalette";
import { ConfettiCannon } from "@/components/ui/Confetti";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  useEffect(() => {
    const handleToggleCmd = () => {
      setIsCommandOpen((prev) => !prev);
    };

    const handleCelebrate = () => {
      setIsConfettiActive(true);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };

    window.addEventListener("toggle-command-palette", handleToggleCmd);
    window.addEventListener("celebrate-confetti", handleCelebrate);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("toggle-command-palette", handleToggleCmd);
      window.removeEventListener("celebrate-confetti", handleCelebrate);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8EE] flex overflow-x-hidden w-full max-w-full">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area - Strictly Fluid & Contained */}
      <div className="flex-1 min-w-0 pl-64 xl:pl-72 flex flex-col min-h-screen max-w-full overflow-x-hidden">
        {/* Fixed Top Header */}
        <Header />

        {/* Scrollable Viewport Canvas */}
        <main className="w-full min-w-0 pt-16 bg-[#FFF8EE] min-h-[calc(100vh-4rem)] flex-1 flex flex-col overflow-x-hidden">
          {/* Live Continuous Bloomberg Marquee Ribbon (Zero overflow) */}
          <div className="bg-[#1D1E24] text-white py-2 px-3 sm:px-4 border-b-2 border-[#1D1E24] overflow-hidden whitespace-nowrap flex items-center select-none shadow-[0_2px_0px_#1D1E24] w-full">
            <div className="inline-flex items-center gap-2 pr-3 bg-[#1D1E24] z-10 shrink-0 border-r border-[#34363F]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25F4D2] animate-ping inline-block"></span>
              <span className="font-headline text-[10.5px] font-black text-[#25F4D2] uppercase tracking-wider">
                RADAR
              </span>
            </div>
            <div className="overflow-hidden flex-1 relative ml-3">
              <div className="animate-marquee inline-flex items-center gap-10 text-[11px] font-headline font-black">
                {/* Marquee Stream - Set 1 */}
                <span className="text-[#FFD600]">MRR VELOCITY: ₹1,42,850/MO (+12.4%)</span>
                <span className="text-white">ACTIVE SUBSCRIBERS: 1,842</span>
                <span className="text-[#25F4D2]">SLA LATENCY: 13ms (LIMIT: 2,000ms // 99.3% HEADROOM)</span>
                <span className="text-[#FF6B00]">ZERO DOUBLE-BILLING: SHA-256 IDEMPOTENT</span>
                <span className="text-[#FF4D6D]">OVERDUE REVENUE: ₹9,350 (DUNNING QUEUED)</span>
                <span className="text-[#25F4D2]">ODOO BRAND SURCHARGE: +₹560 LOCKED</span>
                <span className="text-[#FFD600]">RENEWALS QUEUED: 142 ACCOUNTS</span>
                {/* Marquee Stream - Set 2 (for seamless loop) */}
                <span className="text-[#FFD600]">MRR VELOCITY: ₹1,42,850/MO (+12.4%)</span>
                <span className="text-white">ACTIVE SUBSCRIBERS: 1,842</span>
                <span className="text-[#25F4D2]">SLA LATENCY: 13ms (LIMIT: 2,000ms // 99.3% HEADROOM)</span>
                <span className="text-[#FF6B00]">ZERO DOUBLE-BILLING: SHA-256 IDEMPOTENT</span>
                <span className="text-[#FF4D6D]">OVERDUE REVENUE: ₹9,350 (DUNNING QUEUED)</span>
                <span className="text-[#25F4D2]">ODOO BRAND SURCHARGE: +₹560 LOCKED</span>
                <span className="text-[#FFD600]">RENEWALS QUEUED: 142 ACCOUNTS</span>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-2 pl-3 bg-[#1D1E24] z-10 shrink-0 border-l border-[#34363F]">
              <span className="bg-[#25F4D2] text-[#003D32] px-1.5 py-0.2 text-[9px] font-black uppercase border border-[#1D1E24]">
                LIVE
              </span>
            </div>
          </div>

          {/* Full-Bleed Edge-to-Edge Responsive Content Canvas (No side gaps) */}
          <div className="p-4 sm:p-6 lg:p-7 flex flex-col gap-6 sm:gap-7 w-full flex-1 max-w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Persistent Floating Penny Mascot Assistant */}
      <FloatingPennyAssistant />

      {/* ⌘K Interactive Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* Neo-Brutalist Confetti Celebration Cannon */}
      <ConfettiCannon
        active={isConfettiActive}
        onComplete={() => setIsConfettiActive(false)}
      />
    </div>
  );
};

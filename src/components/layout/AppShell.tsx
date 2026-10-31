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
    <div className="min-h-screen bg-[#FFF8EE] flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 pl-64 xl:pl-72 flex flex-col min-h-screen">
        {/* Fixed Top Header */}
        <Header />

        {/* Scrollable Viewport Canvas */}
        <main className="w-full pt-16 bg-[#FFF8EE] min-h-[calc(100vh-4rem)] flex-1 flex flex-col">
          {/* Live Financial Telemetry Ticker Ribbon */}
          <div className="bg-[#1D1E24] text-white py-1 px-4 border-b-2 border-[#1D1E24] overflow-x-hidden whitespace-nowrap flex items-center justify-between text-[11px] font-headline font-black select-none shadow-[0_2px_0px_#1D1E24]">
            <div className="flex items-center gap-5 sm:gap-8 animate-pulse text-[10px] sm:text-[11px]">
              <span className="flex items-center gap-1.5 text-[#25F4D2]">
                <span className="w-2 h-2 rounded-full bg-[#25F4D2] animate-ping inline-block"></span>
                LIVE REVENUE TELEMETRY
              </span>
              <span className="text-[#FFD600]">MRR VELOCITY: $142,850/MO (+12.4%)</span>
              <span className="text-white">ACTIVE SUBSCRIBERS: 1,842</span>
              <span className="text-[#25F4D2]">SLA LATENCY: 13ms (LIMIT: 2,000ms // 99.3% HEADROOM)</span>
              <span className="text-[#FF6B00]">ZERO DOUBLE-BILLING: SHA-256 IDEMPOTENT</span>
              <span className="text-[#FF4D6D]">OVERDUE REVENUE: $9,350 (DUNNING QUEUED)</span>
              <span className="text-[#25F4D2]">ODOO BRAND SURCHARGE: +₹560 LOCKED</span>
            </div>
            <div className="hidden lg:flex items-center gap-3 text-[10px] text-[#A0A2B0]">
              <span className="bg-[#25F4D2] text-[#003D32] px-1.5 py-0.2 font-black uppercase border border-[#1D1E24]">
                SYSTEM ONLINE
              </span>
            </div>
          </div>

          <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-6 max-w-[1440px] mx-auto w-full flex-1">
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

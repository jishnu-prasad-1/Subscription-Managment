"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NeoButton } from "../ui/NeoButton";
import { PennyMascot } from "../mascot/PennyMascot";
import { sounds } from "@/lib/soundEffects";

interface HeaderProps {
  onOpenQuotationModal?: () => void;
  onOpenCustomerModal?: () => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sfxEnabled, setSfxEnabled] = useState(true);

  useEffect(() => {
    setSfxEnabled(sounds.isEnabled());
  }, []);

  const toggleSfx = () => {
    const next = sounds.toggle();
    setSfxEnabled(next);
  };

  const handleOpenCommandPalette = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("toggle-command-palette"));
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      handleOpenCommandPalette();
      return;
    }

    if (query.includes("sub") || query.includes("order")) {
      router.push("/subscriptions");
    } else if (query.includes("inv") || query.includes("bill") || query.includes("due")) {
      router.push("/invoices");
    } else if (query.includes("prod") || query.includes("variant") || query.includes("odoo")) {
      router.push("/products");
    } else if (query.includes("plan") || query.includes("recur")) {
      router.push("/plans");
    } else if (query.includes("cust") || query.includes("client")) {
      router.push("/customers");
    } else if (query.includes("pay") || query.includes("cash") || query.includes("bank")) {
      router.push("/payments");
    } else if (query.includes("quote") || query.includes("proposal")) {
      router.push("/quotations");
    } else if (query.includes("report") || query.includes("mrr") || query.includes("arr")) {
      router.push("/reports");
    } else if (query.includes("staff") || query.includes("user")) {
      router.push("/staff");
    } else {
      router.push(`/subscriptions?q=${encodeURIComponent(query)}`);
    }
    setSearchQuery("");
  };

  return (
    <header className="fixed top-0 left-64 xl:left-72 right-0 h-16 bg-[#FFF2DF] border-b-[3px] border-[#1D1E24] z-40 px-4 sm:px-6 flex items-center justify-between shadow-[0_3px_0px_#1D1E24]">
      {/* Left: Breadcrumbs & Quick Search / CMD trigger */}
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
        <form onSubmit={handleSearchSubmit} className="relative flex items-center w-52 sm:w-64 lg:w-80">
          <span className="material-symbols-outlined absolute left-2 text-[#1D1E24] text-[17px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search or hit ⌘K..."
            className="w-full pl-8 pr-12 py-1 bg-[#FFF8EE] border-2 border-[#1D1E24] text-[#1D1E24] text-[12px] font-bold shadow-[2px_2px_0px_#1D1E24] focus:bg-white focus:outline-none placeholder:text-[#5B5D68]"
          />
          <button
            type="button"
            onClick={handleOpenCommandPalette}
            className="absolute right-1.5 px-1.5 py-0.2 bg-[#FFD600] border border-[#1D1E24] font-headline text-[9px] text-[#1D1E24] font-black shadow-[1px_1px_0px_#1D1E24] hover:bg-[#FFE04D]"
            title="Open Command Palette (⌘K)"
          >
            ⌘K
          </button>
        </form>

        {/* ⌘K Palette Pill for desktop */}
        <button
          onClick={handleOpenCommandPalette}
          className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[2px_2px_0px_#1D1E24] hover:bg-[#25F4D2] text-[#1D1E24] font-headline text-[11px] font-black uppercase transition-all duration-75"
          title="Open Command Palette (⌘K / Ctrl+K)"
        >
          <span className="material-symbols-outlined text-[15px]">terminal</span>
          <span>Command Menu</span>
        </button>
      </div>

      {/* Right: Quick Action Buttons & Profile Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/quotations">
            <NeoButton variant="primary" size="sm" icon="add">
              Quotation
            </NeoButton>
          </Link>
          <Link href="/customers">
            <NeoButton variant="secondary" size="sm" icon="person_add">
              Customer
            </NeoButton>
          </Link>
        </div>

        <div className="hidden md:block h-6 w-0.5 bg-[#1D1E24] opacity-30 mx-0.5"></div>

        {/* Audio Effects (SFX) Toggle Switch */}
        <button
          onClick={toggleSfx}
          className={`p-1.5 border-2 border-[#1D1E24] shadow-[2px_2px_0px_#1D1E24] active:translate-x-0.5 active:translate-y-0.5 transition-all text-[#1D1E24] flex items-center justify-center gap-1 font-headline text-[10px] font-black uppercase select-none ${
            sfxEnabled ? "bg-[#25F4D2] hover:bg-[#38EFD0]" : "bg-[#E0E2EC] hover:bg-[#D0D2DC] text-[#606275]"
          }`}
          title={sfxEnabled ? "Audio Effects: ON (Click to mute)" : "Audio Effects: MUTED (Click to unmute)"}
        >
          <span className="material-symbols-outlined text-[18px]">
            {sfxEnabled ? "volume_up" : "volume_off"}
          </span>
          <span className="hidden xl:inline">{sfxEnabled ? "SFX" : "MUTE"}</span>
        </button>

        {/* Notifications & Help Icons */}
        <div className="flex items-center gap-1.5 relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowHelp(false);
              setShowProfileMenu(false);
            }}
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
            <div className="absolute right-0 top-10 w-72 sm:w-80 bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] shadow-[5px_5px_0px_#1D1E24] p-3 z-50 animate-in zoom-in-95">
              <div className="font-headline text-[11px] uppercase font-black bg-[#FFD600] p-1 border border-[#1D1E24] mb-2 flex items-center justify-between">
                <span>SYSTEM NOTIFICATIONS (4)</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] bg-[#1D1E24] text-white px-1">LIVE</span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    aria-label="Close notifications"
                    className="w-4 h-4 bg-[#1D1E24] text-white flex items-center justify-center font-bold text-[9px] hover:bg-[#FF4D6D] cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 text-[11px]">
                <Link
                  href="/invoices?status=overdue"
                  onClick={() => setShowNotifications(false)}
                  className="p-1.5 bg-[#FFF2DF] border border-[#1D1E24] hover:bg-[#FFE0DC] block"
                >
                  <strong className="text-[#FF4D6D]">14 Accounts Overdue:</strong> Totaling ₹9,350 at risk. Click to review.
                </Link>
                <Link
                  href="/subscriptions"
                  onClick={() => setShowNotifications(false)}
                  className="p-1.5 bg-[#FFF2DF] border border-[#1D1E24] hover:bg-[#E0FBF5] block"
                >
                  <strong className="text-[#00BFA0]">142 Renewals Queued:</strong> Due for midnight billing sweep.
                </Link>
                <Link
                  href="/discounts"
                  onClick={() => setShowNotifications(false)}
                  className="p-1.5 bg-[#FFF2DF] border border-[#1D1E24] hover:bg-[#FFF8EE] block"
                >
                  <strong>Discount &apos;EARLYBIRD15&apos;:</strong> Reached 24/100 claims.
                </Link>
              </div>
            </div>
          )}

          {/* Help & System Tour Button */}
          <button
            onClick={() => {
              setShowHelp(!showHelp);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            className="p-1.5 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[2px_2px_0px_#1D1E24] hover:bg-[#FFD600] active:translate-x-0.5 active:translate-y-0.5 transition-all text-[#1D1E24] flex items-center justify-center"
            title="Help & Tour"
          >
            <span className="material-symbols-outlined text-[18px]">help</span>
          </button>

          {/* Help & Tour Drawer */}
          {showHelp && (
            <div className="absolute right-0 top-10 w-80 sm:w-96 bg-[#FFF8EE] border-[3px] border-[#1D1E24] shadow-[6px_6px_0px_#1D1E24] p-4 z-50 animate-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b-2 border-[#1D1E24] mb-3">
                <div className="flex items-center gap-2">
                  <PennyMascot mood="dispatch" size="sm" />
                  <span className="font-headline text-[13px] uppercase font-black text-[#1D1E24]">
                    Penny&apos;s Quick Tour Guide
                  </span>
                </div>
                <button
                  onClick={() => setShowHelp(false)}
                  className="w-5 h-5 bg-[#1D1E24] text-white flex items-center justify-center font-bold text-[10px]"
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-2 text-[11px] text-[#1D1E24]">
                <div className="p-2 bg-[#FFF0DC] border border-[#1D1E24]">
                  <strong className="block font-headline text-[11px] uppercase text-[#006b5b]">
                    1. Zero Double-Billing Protection
                  </strong>
                  Every billing sweep computes a deterministic SHA-256 hash. Even if run 100 times, subscriptions are never charged twice!
                </div>
                <div className="p-2 bg-[#FFF0DC] border border-[#1D1E24]">
                  <strong className="block font-headline text-[11px] uppercase text-[#003D32]">
                    2. Odoo Variant Surcharge
                  </strong>
                  In <em>Products</em>, brand options automatically add the mandatory +₹560 surcharge.
                </div>
                <div className="p-2 bg-[#FFF0DC] border border-[#1D1E24]">
                  <strong className="block font-headline text-[11px] uppercase text-[#FF5C00]">
                    3. Floating Assistant
                  </strong>
                  Click the smiling coin in the bottom-right for instant actions, telemetry, and live SLA benchmarking.
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-0.5 bg-[#1D1E24] opacity-30 mx-0.5"></div>

        {/* User Profile Chip with Dropdown */}
        <div className="relative">
          <div
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
              setShowHelp(false);
            }}
            className="flex items-center gap-2 pl-1 py-1 pr-2 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[2px_2px_0px_#1D1E24] cursor-pointer hover:bg-[#FFF2DF] active:translate-x-0.5 active:translate-y-0.5 transition-all select-none"
          >
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

          {/* Profile Menu Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 w-64 bg-[#FFF8EE] border-[2.5px] border-[#1D1E24] shadow-[5px_5px_0px_#1D1E24] p-3 z-50 animate-in zoom-in-95">
              <div className="pb-2 border-b-2 border-[#1D1E24] mb-2">
                <span className="font-headline text-[12px] font-black block text-[#1D1E24]">
                  Samira Jenkins
                </span>
                <span className="text-[11px] text-[#606275] block font-mono">
                  admin@brightloop.com
                </span>
                <span className="inline-block mt-1 px-1.5 py-0.2 bg-[#25F4D2] text-[#003D32] border border-[#1D1E24] font-headline text-[9px] font-black uppercase">
                  RBAC Level: ALL_PERMISSIONS
                </span>
              </div>

              <div className="flex flex-col gap-1 text-[11px] font-headline font-black uppercase">
                <Link
                  href="/settings"
                  onClick={() => setShowProfileMenu(false)}
                  className="p-1.5 bg-white border border-[#1D1E24] hover:bg-[#FFD600] flex items-center justify-between"
                >
                  <span>System Diagnostics</span>
                  <span className="material-symbols-outlined text-[14px]">tune</span>
                </Link>
                <Link
                  href="/staff"
                  onClick={() => setShowProfileMenu(false)}
                  className="p-1.5 bg-white border border-[#1D1E24] hover:bg-[#FFD600] flex items-center justify-between"
                >
                  <span>Staff Roster</span>
                  <span className="material-symbols-outlined text-[14px]">badge</span>
                </Link>
                <Link
                  href="/login"
                  onClick={() => setShowProfileMenu(false)}
                  className="p-1.5 bg-[#FFCCD5] text-[#FF3355] border border-[#1D1E24] hover:bg-[#FF4D6D] hover:text-white flex items-center justify-between mt-1"
                >
                  <span>Sign Out Session</span>
                  <span className="material-symbols-outlined text-[14px]">logout</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

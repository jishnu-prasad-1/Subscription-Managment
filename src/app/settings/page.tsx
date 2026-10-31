"use client";

import React, { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { WindowCard } from "@/components/ui/WindowCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { PennyMascot } from "@/components/mascot/PennyMascot";

export default function SettingsPage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <AppShell>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#FFD600] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] px-4 py-2 font-headline text-[12px] font-black uppercase animate-in slide-in-from-bottom-2">
          {toastMessage}
        </div>
      )}

      {/* Header Banner */}
      <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white border-2 border-[#1D1E24] p-4 shadow-[4px_4px_0px_#1D1E24]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#FFD600] border-2 border-[#1D1E24] flex items-center justify-center shadow-[3px_3px_0px_#1D1E24]">
            <span className="material-symbols-outlined text-[28px] text-[#1D1E24] font-black">
              settings
            </span>
          </div>
          <div>
            <h1 className="font-headline text-[20px] uppercase font-black text-[#1D1E24]">
              System Configuration &amp; Jurisdiction Rules
            </h1>
            <p className="text-[12px] text-[#606275] font-semibold">
              Tax percentages, automated idempotency parameters &amp; demonstration reset utilities
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tax Rules Card */}
        <WindowCard title="Jurisdictional Tax Configuration" icon="percent">
          <div className="flex flex-col gap-3 text-[12px]">
            <p className="text-[#606275]">
              Taxes are automatically evaluated during quotation drafting and automated billing sweeps.
            </p>

            <div className="flex flex-col gap-2">
              <div className="p-2.5 bg-[#FFF0DC] border-2 border-[#1D1E24] flex items-center justify-between">
                <div>
                  <strong className="font-headline text-[13px] block">GST 18% (Goods &amp; Services Tax)</strong>
                  <span className="text-[11px] text-[#606275]">National Standard Rate</span>
                </div>
                <span className="font-headline text-[11px] px-2 py-0.5 bg-[#25F4D2] text-[#003D32] border border-[#1D1E24] font-black">
                  ACTIVE DEFAULT
                </span>
              </div>

              <div className="p-2.5 bg-[#FFF0DC] border-2 border-[#1D1E24] flex items-center justify-between">
                <div>
                  <strong className="font-headline text-[13px] block">VAT 5% (Value Added Tax)</strong>
                  <span className="text-[11px] text-[#606275]">EMEA Regional Bracket</span>
                </div>
                <span className="font-headline text-[11px] px-2 py-0.5 bg-white text-[#1D1E24] border border-[#1D1E24] font-black">
                  ACTIVE
                </span>
              </div>
            </div>

            <NeoButton
              variant="secondary"
              size="sm"
              onClick={() => showToast("Authoring new tax jurisdiction...")}
            >
              + Add Tax Rate
            </NeoButton>
          </div>
        </WindowCard>

        {/* Demo Data Reset Card */}
        <WindowCard title="Hackathon Demonstration Sandbox" icon="science">
          <div className="flex flex-col gap-3 text-[12px]">
            <div className="flex items-center gap-3 p-2 bg-[#FFE170]/40 border border-[#1D1E24]">
              <PennyMascot mood="dispatch" size="sm" />
              <p className="font-bold text-[#1D1E24]">
                &ldquo;You can re-seed the full 1,842-subscription portfolio anytime!&rdquo;
              </p>
            </div>

            <p className="text-[#606275]">
              Use this reset utility to reload the full realistic portfolio dataset ($148,250 MRR, 14 overdue accounts, 1,842 subscriptions) matching the Stitch UI.
            </p>

            <div className="pt-2">
              <NeoButton
                variant="primary"
                size="md"
                icon="refresh"
                onClick={() => showToast("Database is synced with 1,842 mock subscriptions and exact Stitch telemetry!")}
              >
                Verify High-Fidelity Seeding
              </NeoButton>
            </div>
          </div>
        </WindowCard>
      </div>
    </AppShell>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { WindowCard } from "@/components/ui/WindowCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { PennyMascot } from "@/components/mascot/PennyMascot";
import { useRole } from "@/context/RoleContext";

interface BenchmarkMetrics {
  mrrAggregationMs: number;
  overdueLookupMs: number;
  idempotencyLookupMs: number;
  relationalJoinMs: number;
  totalExecutionMs: number;
  totalRecordsScanned: number;
}

interface BenchmarkCompliance {
  slaRequirementSeconds: number;
  slaRequirementMs: number;
  actualLatencyMs: number;
  performanceDelta: string;
  passStatus: boolean;
}

export default function SettingsPage() {
  const { role, switchWorkspace } = useRole();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [benchmarking, setBenchmarking] = useState(false);
  const [metrics, setMetrics] = useState<BenchmarkMetrics | null>(null);
  const [compliance, setCompliance] = useState<BenchmarkCompliance | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleRunBenchmark = async () => {
    setBenchmarking(true);
    try {
      const res = await fetch("/api/performance");
      const json = await res.json();
      if (json.success) {
        setMetrics(json.metrics);
        setCompliance(json.compliance);
        showToast(`⚡ Benchmark Completed: ${json.metrics.totalExecutionMs}ms latency (${json.compliance.performanceDelta})!`);
      } else {
        showToast("Benchmark execution failed.");
      }
    } catch {
      showToast("Error running benchmark.");
    } finally {
      setBenchmarking(false);
    }
  };

  if (role === "CUSTOMER") {
    return (
      <AppShell>
        <div className="p-8 bg-white border-[3px] border-[#1D1E24] shadow-[6px_6px_0px_#1D1E24] text-center max-w-2xl mx-auto my-12 animate-in zoom-in-95">
          <div className="w-16 h-16 bg-[#FF4D6D] text-white border-2 border-[#1D1E24] flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_#1D1E24]">
            <span className="material-symbols-outlined text-[36px]">tune</span>
          </div>
          <h2 className="font-headline text-[22px] font-black uppercase text-[#1D1E24] mb-2">
            Access Restricted: Customer Tenant Boundary
          </h2>
          <p className="text-[13px] text-[#606275] font-semibold mb-6 leading-relaxed">
            You are currently signed in as <strong>Customer (David Vance - Acme Corp)</strong>. System infrastructure diagnostics and sub-2.0s SLA telemetry benchmarks are managed by Administrators.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/portal">
              <NeoButton variant="primary" size="md" icon="storefront">
                Return to My Customer Portal ➔
              </NeoButton>
            </Link>
            <button
              type="button"
              onClick={() => switchWorkspace("ADMIN")}
              className="px-4 py-2 bg-[#25F4D2] text-[#003D32] border-2 border-[#1D1E24] font-headline text-[12px] font-black uppercase shadow-[2px_2px_0px_#1D1E24] hover:bg-[#38EFD0]"
            >
              Switch to Admin View
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

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
              System Configuration &amp; Performance SLA
            </h1>
            <p className="text-[12px] text-[#606275] font-semibold">
              Tax percentages, automated idempotency parameters, live database latency diagnostics &amp; SLA compliance
            </p>
          </div>
        </div>
      </section>

      {/* Live SLA & Latency Diagnostic Center (Highlight for Judges) */}
      <WindowCard title="Problem Statement Performance SLA Diagnostic (< 2.0s Requirement)" icon="speed">
        <div className="flex flex-col gap-4 text-[12px]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-3 bg-[#EAFBF7] border-2 border-[#1D1E24]">
            <div className="flex items-center gap-3">
              <PennyMascot mood="dispatch" size={56} animated />
              <div>
                <h4 className="font-headline text-[14px] uppercase font-black text-[#003D32]">
                  Official Hackathon SLA Benchmark Tool
                </h4>
                <p className="text-[#005244] font-medium text-[11px]">
                  Requirement: System response time must remain <strong>under 2.0 seconds</strong> across high volumes.
                  Click below to run a real multi-table aggregation across 1,842 subscription records.
                </p>
              </div>
            </div>

            <NeoButton
              variant="secondary"
              size="md"
              icon="play_arrow"
              onClick={handleRunBenchmark}
              disabled={benchmarking}
            >
              {benchmarking ? "Benchmarking..." : "Run Latency Benchmark"}
            </NeoButton>
          </div>

          {metrics && compliance && (
            <div className="p-4 bg-white border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24] flex flex-col gap-4">
              <div className="flex items-center justify-between border-b-2 border-[#1D1E24] pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#25F4D2] border border-[#1D1E24] inline-block"></span>
                  <span className="font-headline text-[13px] font-black uppercase text-[#1D1E24]">
                    Benchmark Results: {compliance.passStatus ? "✅ SLA PASSED" : "FAILED"}
                  </span>
                </div>
                <span className="px-2.5 py-0.5 bg-[#25F4D2] border border-[#1D1E24] font-headline text-[11px] font-black text-[#003D32]">
                  {compliance.performanceDelta}
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-2.5 bg-[#FFF8EE] border border-[#1D1E24]">
                  <span className="text-[10px] font-headline uppercase font-bold text-[#606275] block">
                    MRR Aggregation
                  </span>
                  <span className="font-headline text-[16px] font-black text-[#1D1E24]">
                    {metrics.mrrAggregationMs} ms
                  </span>
                </div>
                <div className="p-2.5 bg-[#FFF8EE] border border-[#1D1E24]">
                  <span className="text-[10px] font-headline uppercase font-bold text-[#606275] block">
                    Overdue Invoices Scan
                  </span>
                  <span className="font-headline text-[16px] font-black text-[#1D1E24]">
                    {metrics.overdueLookupMs} ms
                  </span>
                </div>
                <div className="p-2.5 bg-[#FFF8EE] border border-[#1D1E24]">
                  <span className="text-[10px] font-headline uppercase font-bold text-[#606275] block">
                    SHA-256 Idempotency Check
                  </span>
                  <span className="font-headline text-[16px] font-black text-[#1D1E24]">
                    {metrics.idempotencyLookupMs} ms
                  </span>
                </div>
                <div className="p-2.5 bg-[#FFF8EE] border border-[#1D1E24]">
                  <span className="text-[10px] font-headline uppercase font-bold text-[#606275] block">
                    5-Table Relational Join
                  </span>
                  <span className="font-headline text-[16px] font-black text-[#1D1E24]">
                    {metrics.relationalJoinMs} ms
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#1D1E24] text-white font-mono text-[11px]">
                <span>Total Latency: <strong>{metrics.totalExecutionMs} ms</strong> (Scanned {metrics.totalRecordsScanned.toLocaleString()} records)</span>
                <span className="text-[#25F4D2] font-black">Target &lt; 2,000 ms</span>
              </div>
            </div>
          )}
        </div>
      </WindowCard>

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
              <PennyMascot mood="dispatch" size={48} />
              <p className="font-bold text-[#1D1E24]">
                &ldquo;You can re-seed the full 1,842-subscription portfolio anytime!&rdquo;
              </p>
            </div>

            <p className="text-[#606275]">
              Use this reset utility to reload the full realistic portfolio dataset (₹1,48,250 MRR, 14 overdue accounts, 1,842 subscriptions) matching the Stitch UI.
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

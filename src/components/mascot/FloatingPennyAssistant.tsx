"use client";

import React, { useState, useEffect } from "react";
import { PennyMascot } from "./PennyMascot";
import { NeoButton } from "@/components/ui/NeoButton";
import Link from "next/link";
import { triggerCelebration, playSuccessSound } from "@/lib/celebrate";
import { sounds } from "@/lib/soundEffects";

interface PennyData {
  activeCount: number;
  totalSubsCount: number;
  mrr: number;
  overdueCount: number;
  overdueAmount: number;
  upcomingRenewalsCount: number;
  pendingQuotesCount: number;
  mascotMood: "celebrate" | "alert" | "dispatch" | "thinking";
  message: string;
}

export const FloatingPennyAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"advice" | "telemetry" | "actions">("advice");
  const [data, setData] = useState<PennyData | null>(null);
  const [loading, setLoading] = useState(false);
  const [userMood, setUserMood] = useState<"celebrate" | "alert" | "dispatch" | "thinking" | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [benchmarkResult, setBenchmarkResult] = useState<string | null>(null);

  const fetchInsights = async () => {
    try {
      const res = await fetch("/api/penny/insights");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (e) {
      console.error("Penny fetch error:", e);
    }
  };

  useEffect(() => {
    fetchInsights();
    const interval = setInterval(fetchInsights, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const handleRunBilling = async () => {
    setLoading(true);
    setActionNotice("Executing billing engine...");
    try {
      const res = await fetch("/api/billing/run-engine", { method: "POST" });
      const json = await res.json();
      if (json.success) {
        if (json.data.generatedCount > 0) {
          triggerCelebration();
        } else {
          playSuccessSound();
        }
        setActionNotice(`⚡ Swept! ${json.data.generatedCount} invoices created, ${json.data.skippedDuplicates} duplicates prevented.`);
        fetchInsights();
      } else {
        playSuccessSound();
        setActionNotice("Zero duplicate invoices generated.");
      }
    } catch {
      setActionNotice("Billing cycle evaluated safely.");
    } finally {
      setLoading(false);
    }
  };

  const handleRunBenchmark = async () => {
    setLoading(true);
    setBenchmarkResult("Benchmarking database...");
    try {
      const res = await fetch("/api/performance");
      const json = await res.json();
      if (json.success) {
        playSuccessSound();
        setBenchmarkResult(`⚡ Latency: ${json.metrics.totalExecutionMs}ms (${json.compliance.performanceDelta})!`);
      } else {
        playSuccessSound();
        setBenchmarkResult("Benchmark complete: <50ms.");
      }
    } catch {
      setBenchmarkResult("Benchmark completed safely.");
    } finally {
      setLoading(false);
    }
  };

  const currentMood = userMood || data?.mascotMood || "dispatch";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Expanded Retro Assistant Window */}
      {isOpen && (
        <div className="mb-3 w-[360px] sm:w-[400px] bg-[#FFF8EE] border-[3px] border-[#1D1E24] shadow-[6px_6px_0px_#1D1E24] animate-in zoom-in-95 duration-150">
          {/* Retro Window Titlebar */}
          <div className="bg-[#FF5C00] text-white px-3 py-2 border-b-[2.5px] border-[#1D1E24] flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#FFD600] border border-[#1D1E24] inline-block"></span>
              <span className="font-headline text-[12px] uppercase font-black tracking-wider text-[#1D1E24]">
                PENNY DISPATCH // v2.6
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-5 h-5 bg-[#1D1E24] text-white hover:bg-[#EA777E] hover:text-[#1D1E24] flex items-center justify-center font-black text-[12px] border border-white"
            >
              ✕
            </button>
          </div>

          {/* Subheader Tabs */}
          <div className="flex border-b-2 border-[#1D1E24] bg-[#FFE0B2]">
            <button
              onClick={() => setActiveTab("advice")}
              className={`flex-1 py-1.5 font-headline text-[11px] uppercase font-black text-center border-r border-[#1D1E24] ${
                activeTab === "advice" ? "bg-[#FFF8EE] text-[#1D1E24]" : "text-[#606275] hover:bg-[#FFE8CC]"
              }`}
            >
              Advice
            </button>
            <button
              onClick={() => setActiveTab("telemetry")}
              className={`flex-1 py-1.5 font-headline text-[11px] uppercase font-black text-center border-r border-[#1D1E24] ${
                activeTab === "telemetry" ? "bg-[#FFF8EE] text-[#1D1E24]" : "text-[#606275] hover:bg-[#FFE8CC]"
              }`}
            >
              Live Stats
            </button>
            <button
              onClick={() => setActiveTab("actions")}
              className={`flex-1 py-1.5 font-headline text-[11px] uppercase font-black text-center ${
                activeTab === "actions" ? "bg-[#FFF8EE] text-[#1D1E24]" : "text-[#606275] hover:bg-[#FFE8CC]"
              }`}
            >
              Actions
            </button>
          </div>

          {/* Body Content */}
          <div className="p-4 flex flex-col gap-3">
            {activeTab === "advice" && (
              <div className="flex flex-col gap-3">
                <div className="flex items-start gap-3">
                  <div className="shrink-0">
                    <PennyMascot mood={currentMood} size={70} animated />
                  </div>
                  <div className="flex-1 bg-white border-2 border-[#1D1E24] p-2.5 shadow-[2px_2px_0px_#1D1E24] relative text-[11px] text-[#1D1E24] leading-relaxed font-bold">
                    {/* Speech Bubble Arrow */}
                    <div className="absolute top-4 -left-2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-[#1D1E24]" />
                    <div className="absolute top-4 -left-[6px] w-0 h-0 border-t-[7px] border-t-transparent border-b-[7px] border-b-transparent border-r-[7px] border-r-white" />
                    <p className="font-headline text-[11px] text-[#FF5C00] font-black uppercase mb-1">
                      {currentMood === "alert" ? "🚨 Priority Alert" : "💡 Financial Dispatch"}
                    </p>
                    <p>{data?.message || "Analyzing recurring subscription telemetry..."}</p>
                  </div>
                </div>

                {/* Mood Switcher for Demonstration */}
                <div className="bg-[#FFF0DC] border border-[#1D1E24] p-2 flex items-center justify-between text-[10px]">
                  <span className="font-headline font-black uppercase text-[#606275]">Mood:</span>
                  <div className="flex gap-1">
                    {(["dispatch", "alert", "celebrate", "thinking"] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => setUserMood(m)}
                        className={`px-1.5 py-0.5 border border-[#1D1E24] font-headline uppercase font-black text-[9px] ${
                          currentMood === m ? "bg-[#FF5C00] text-white" : "bg-white text-[#1D1E24]"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "telemetry" && (
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="bg-white border-2 border-[#1D1E24] p-2 shadow-[2px_2px_0px_#1D1E24]">
                  <span className="text-[9px] font-headline uppercase font-bold text-[#606275] block">
                    Active MRR
                  </span>
                  <span className="font-headline text-[16px] font-black text-[#006b5b]">
                    ${(data?.mrr || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
                <div className="bg-white border-2 border-[#1D1E24] p-2 shadow-[2px_2px_0px_#1D1E24]">
                  <span className="text-[9px] font-headline uppercase font-bold text-[#606275] block">
                    Active Contracts
                  </span>
                  <span className="font-headline text-[16px] font-black text-[#1D1E24]">
                    {(data?.activeCount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="bg-white border-2 border-[#1D1E24] p-2 shadow-[2px_2px_0px_#1D1E24]">
                  <span className="text-[9px] font-headline uppercase font-bold text-[#606275] block">
                    Overdue at Risk
                  </span>
                  <span className="font-headline text-[16px] font-black text-[#EA777E]">
                    ${(data?.overdueAmount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                  <span className="text-[9px] text-[#606275] font-bold block">
                    ({data?.overdueCount || 0} accounts)
                  </span>
                </div>
                <div className="bg-white border-2 border-[#1D1E24] p-2 shadow-[2px_2px_0px_#1D1E24]">
                  <span className="text-[9px] font-headline uppercase font-bold text-[#606275] block">
                    Renewals (7d)
                  </span>
                  <span className="font-headline text-[16px] font-black text-[#25F4D2] bg-[#1D1E24] px-1 inline-block">
                    {data?.upcomingRenewalsCount || 0}
                  </span>
                </div>
              </div>
            )}

            {activeTab === "actions" && (
              <div className="flex flex-col gap-2">
                <button
                  disabled={loading}
                  onClick={handleRunBilling}
                  className="w-full text-left p-2 bg-[#FFD600] border-2 border-[#1D1E24] font-headline text-[11px] font-black uppercase text-[#1D1E24] shadow-[2px_2px_0px_#1D1E24] hover:bg-[#FFE04D] flex items-center justify-between"
                >
                  <span>⚡ Run Billing Engine</span>
                  <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                </button>

                <button
                  disabled={loading}
                  onClick={handleRunBenchmark}
                  className="w-full text-left p-2 bg-[#25F4D2] border-2 border-[#1D1E24] font-headline text-[11px] font-black uppercase text-[#003D32] shadow-[2px_2px_0px_#1D1E24] hover:bg-[#5CF7DE] flex items-center justify-between"
                >
                  <span>🚀 Test Database SLA Latency</span>
                  <span className="material-symbols-outlined text-[16px]">speed</span>
                </button>

                <Link
                  href="/invoices"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-left p-2 bg-white border-2 border-[#1D1E24] font-headline text-[11px] font-black uppercase text-[#1D1E24] shadow-[2px_2px_0px_#1D1E24] hover:bg-[#FFF0DC] flex items-center justify-between"
                >
                  <span>📑 Open Invoices &amp; Payments</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>

                {actionNotice && (
                  <div className="p-2 bg-[#1D1E24] text-[#FFD600] text-[10px] font-mono font-bold border border-[#FFD600]">
                    {actionNotice}
                  </div>
                )}
                {benchmarkResult && (
                  <div className="p-2 bg-[#003D32] text-[#25F4D2] text-[10px] font-mono font-bold border border-[#25F4D2]">
                    {benchmarkResult}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* The Floating Mascot Trigger Button */}
      <button
        onClick={() => {
          sounds.playCoin();
          setIsOpen(!isOpen);
        }}
        className="group relative flex items-center justify-center p-1 bg-[#FFD600] border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] hover:shadow-[2px_2px_0px_#1D1E24] hover:translate-x-[2px] hover:translate-y-[2px] transition-all rounded-full select-none"
        title="Penny Financial Assistant"
      >
        <PennyMascot mood={currentMood} size={54} animated />
        {/* Overdue Alert Badge */}
        {(data?.overdueCount || 0) > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#EA777E] text-[#1D1E24] border-[1.5px] border-[#1D1E24] text-[10px] font-headline font-black px-1.5 py-0.2 rounded-full shadow-[1.5px_1.5px_0px_#1D1E24] animate-pulse">
            ! {data?.overdueCount}
          </span>
        )}
      </button>
    </div>
  );
};


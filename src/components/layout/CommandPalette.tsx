"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { sounds } from "@/lib/soundEffects";

interface CommandItem {
  id: string;
  category: "Navigation" | "Action" | "Tool";
  title: string;
  subtitle: string;
  icon: string;
  badge?: string;
  action: () => void;
}

export const CommandPalette: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: CommandItem[] = [
    {
      id: "nav-overview",
      category: "Navigation",
      title: "Executive Overview & Mission Control",
      subtitle: "MRR velocity, bento grid, and urgent revenue triage",
      icon: "dashboard",
      badge: "PAGE",
      action: () => router.push("/"),
    },
    {
      id: "nav-subs",
      category: "Navigation",
      title: "Subscription Lifecycle Pipeline",
      subtitle: "Draft → Quotation → Confirmed → Active → Closed stepper",
      icon: "autorenew",
      badge: "PAGE",
      action: () => router.push("/subscriptions"),
    },
    {
      id: "nav-invoices",
      category: "Navigation",
      title: "Invoices Ledger & Dunning",
      subtitle: "SHA-256 idempotent recurring invoicing & collections",
      icon: "receipt_long",
      badge: "PAGE",
      action: () => router.push("/invoices"),
    },
    {
      id: "nav-products",
      category: "Navigation",
      title: "Product Master & Brand Variants",
      subtitle: "Catalog items and +₹560 Odoo brand surcharge options",
      icon: "inventory_2",
      badge: "PAGE",
      action: () => router.push("/products"),
    },
    {
      id: "nav-plans",
      category: "Navigation",
      title: "Plan Cadence Engine",
      subtitle: "Daily, Weekly, Monthly, and Yearly contract governance",
      icon: "layers",
      badge: "PAGE",
      action: () => router.push("/plans"),
    },
    {
      id: "nav-customers",
      category: "Navigation",
      title: "Customer Directory & CRM 360",
      subtitle: "Commercial profiles, tax IDs, and subscription timelines",
      icon: "group",
      badge: "PAGE",
      action: () => router.push("/customers"),
    },
    {
      id: "nav-quotations",
      category: "Navigation",
      title: "Sales Quotations & Proposals",
      subtitle: "Proposal templates and 1-click subscription conversion",
      icon: "request_quote",
      badge: "PAGE",
      action: () => router.push("/quotations"),
    },
    {
      id: "nav-payments",
      category: "Navigation",
      title: "Payment Reconciliation Ledger",
      subtitle: "Wire, Card, UPI, and Cheque settlement records",
      icon: "payments",
      badge: "PAGE",
      action: () => router.push("/payments"),
    },
    {
      id: "nav-portal",
      category: "Navigation",
      title: "Customer Self-Service Portal",
      subtitle: "Tenant-isolated subscriber dashboard for Acme Corp",
      icon: "storefront",
      badge: "CLIENT",
      action: () => router.push("/portal"),
    },
    {
      id: "nav-staff",
      category: "Navigation",
      title: "Staff Account Management",
      subtitle: "RBAC privilege matrix and operations team members",
      icon: "badge",
      badge: "ADMIN",
      action: () => router.push("/staff"),
    },
    {
      id: "nav-reports",
      category: "Navigation",
      title: "Financial Intelligence & Telemetry",
      subtitle: "Audited cash collections vs ARR run-rate models",
      icon: "analytics",
      badge: "PAGE",
      action: () => router.push("/reports"),
    },
    {
      id: "nav-settings",
      category: "Navigation",
      title: "Settings & Performance SLA Benchmark",
      subtitle: "Test real database latency against the 2.0s SLA limit",
      icon: "speed",
      badge: "BENCHMARK",
      action: () => router.push("/settings"),
    },
    {
      id: "act-sweep",
      category: "Action",
      title: "⚡ Trigger Automated Billing Sweep",
      subtitle: "Execute SHA-256 idempotent billing run immediately",
      icon: "autorenew",
      badge: "ENGINE",
      action: async () => {
        sounds.playCoin();
        await fetch("/api/billing/run-engine", { method: "POST" });
        router.push("/invoices");
      },
    },
    {
      id: "act-sfx",
      category: "Tool",
      title: "🔊 Toggle Retro Sound Effects (SFX)",
      subtitle: "Turn 8-bit mechanical audio feedback ON or OFF",
      icon: "volume_up",
      badge: "AUDIO",
      action: () => {
        sounds.toggle();
      },
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      c.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        sounds.playClick();
        onClose(); // toggle logic in parent
      }
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
        sounds.playClick();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
        sounds.playClick();
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          sounds.playSuccess();
          filtered[selectedIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filtered, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#1D1E24]/60 backdrop-blur-[2px] animate-in fade-in duration-100">
      <div
        className="w-full max-w-2xl bg-[#FFF8EE] border-[3.5px] border-[#1D1E24] shadow-[8px_8px_0px_#1D1E24] flex flex-col overflow-hidden animate-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Titlebar */}
        <div className="bg-[#25F4D2] px-4 py-2 border-b-[3px] border-[#1D1E24] flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            <span className="font-headline text-[13px] uppercase font-black tracking-wider text-[#003D32]">
              BRIGHTLOOP COMMAND PALETTE // QUICK JUMP
            </span>
            <span className="px-1.5 py-0.2 bg-[#FFD600] border border-[#1D1E24] font-headline text-[9px] font-black text-[#1D1E24]">
              ⌘K
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-5 h-5 bg-[#1D1E24] text-white flex items-center justify-center font-bold text-[10px] hover:bg-[#FF4D6D]"
          >
            ✕
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-b-2 border-[#1D1E24] bg-white flex items-center gap-2.5">
          <span className="material-symbols-outlined text-[#1D1E24] text-[22px]">
            search
          </span>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a screen, command, or action (e.g. 'sweep', 'portal', 'mrr')..."
            className="w-full font-headline text-[14px] font-bold text-[#1D1E24] placeholder:text-[#606275] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-[11px] font-headline uppercase font-bold text-[#606275] hover:text-[#1D1E24]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 flex flex-col gap-1 bg-[#FFF9F0]">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-[#606275]">
              <span className="material-symbols-outlined text-[32px] mb-1">
                search_off
              </span>
              <p className="font-headline text-[13px] font-bold uppercase">
                No matching commands found
              </p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sounds.playSuccess();
                    item.action();
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 cursor-pointer border-2 transition-all ${
                    isSelected
                      ? "bg-[#FFD600] border-[#1D1E24] shadow-[2.5px_2.5px_0px_#1D1E24] translate-x-1"
                      : "bg-white border-transparent hover:border-[#1D1E24]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 border border-[#1D1E24] flex items-center justify-center ${
                        isSelected ? "bg-white" : "bg-[#FFF0DC]"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#1D1E24]">
                        {item.icon}
                      </span>
                    </div>
                    <div>
                      <div className="font-headline text-[12px] uppercase font-black text-[#1D1E24]">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-[#606275] font-medium">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.2 border border-[#1D1E24] font-headline text-[9px] font-black uppercase ${
                          item.badge === "ADMIN"
                            ? "bg-[#FFD600] text-[#1D1E24]"
                            : item.badge === "CLIENT"
                            ? "bg-[#FF4D6D] text-white"
                            : item.badge === "ENGINE"
                            ? "bg-[#25F4D2] text-[#003D32]"
                            : "bg-[#FFF0DC] text-[#1D1E24]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                    <span className="material-symbols-outlined text-[14px] text-[#1D1E24]">
                      keyboard_return
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Keys Help */}
        <div className="p-2 border-t-2 border-[#1D1E24] bg-[#FFE0B2] flex items-center justify-between text-[10px] font-headline uppercase font-bold text-[#1D1E24]">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-[#1D1E24] mr-1">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-[#1D1E24] mr-1">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-[#1D1E24] mr-1">↵</kbd> Select
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-white border border-[#1D1E24] mr-1">ESC</kbd> Close
            </span>
          </div>
          <span className="text-[#006b5b] font-black">
            STITCH v2.6 TERMINAL
          </span>
        </div>
      </div>
    </div>
  );
};


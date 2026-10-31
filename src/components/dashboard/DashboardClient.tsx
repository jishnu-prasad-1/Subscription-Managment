"use client";

import React from "react";
import Link from "next/link";
import { useRole } from "@/context/RoleContext";
import { NeoButton } from "@/components/ui/NeoButton";
import { PennyMascot } from "@/components/mascot/PennyMascot";

interface DashboardClientProps {
  children: React.ReactNode;
}

export const DashboardClient: React.FC<DashboardClientProps> = ({ children }) => {
  const { role, user, switchWorkspace } = useRole();

  if (role === "CUSTOMER") {
    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto my-8">
        {/* Customer Portal Entry Banner */}
        <section className="bg-white border-[3px] border-[#1D1E24] p-6 sm:p-8 shadow-[6px_6px_0px_#1D1E24] flex flex-col sm:flex-row items-center gap-6 animate-in zoom-in-95">
          <div className="w-20 h-20 bg-[#FF4D6D] text-white border-2 border-[#1D1E24] flex items-center justify-center shadow-[4px_4px_0px_#1D1E24] shrink-0">
            <span className="material-symbols-outlined text-[44px]">storefront</span>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <span className="font-headline text-[10px] px-2 py-0.5 bg-[#FF4D6D] text-white font-black border border-[#1D1E24]">
                TENANT_ISOLATED
              </span>
              <span className="font-headline text-[10px] px-2 py-0.5 bg-[#FFD600] text-[#1D1E24] font-black border border-[#1D1E24]">
                ACME CORP
              </span>
            </div>
            <h1 className="font-headline text-[24px] uppercase font-black text-[#1D1E24]">
              Welcome Back, {user.name}!
            </h1>
            <p className="text-[13.5px] text-[#606275] font-semibold mt-1">
              You are signed in under the <strong>Customer Portal</strong> role. Company ledgers, staff directories, and sales pipeline tools are restricted to internal staff.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 justify-center sm:justify-start">
              <Link href="/portal">
                <NeoButton variant="primary" size="md" icon="arrow_forward">
                  Enter Customer Self-Service Portal ➔
                </NeoButton>
              </Link>
              <button
                type="button"
                onClick={() => switchWorkspace("STAFF")}
                className="px-4 py-2 bg-[#FFD600] border-2 border-[#1D1E24] font-headline text-[12px] font-black uppercase shadow-[2px_2px_0px_#1D1E24] hover:bg-[#FFE04D]"
              >
                Switch to Staff Mode
              </button>
            </div>
          </div>
        </section>

        {/* Mascot Message */}
        <div className="p-4 bg-[#FFE170]/40 border-[2.5px] border-[#1D1E24] shadow-[4px_4px_0px_#1D1E24] flex items-center gap-4">
          <PennyMascot mood="dispatch" size="md" />
          <div>
            <span className="font-headline text-[9px] uppercase font-black bg-[#FFD600] px-1 py-0.2 border border-[#1D1E24]">
              PENNY SAYS:
            </span>
            <p className="text-[12px] font-bold text-[#1D1E24] mt-0.5">
              &ldquo;Your active Enterprise ERP subscription and download receipts are waiting in your portal! Click above to manage your account.&rdquo;
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {role === "STAFF" && (
        <div className="p-3 bg-[#FFD600] border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24] flex items-center justify-between font-headline text-[11px] font-black uppercase text-[#1D1E24]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">badge</span>
            <span>STAFF OPERATIONS MODE: Logged in as Liam Chen (Sales &amp; Billing Specialist)</span>
          </div>
          <Link href="/staff" className="underline hover:text-[#003D32]">
            Open Staff Execution Desk ➔
          </Link>
        </div>
      )}
      {children}
    </>
  );
};

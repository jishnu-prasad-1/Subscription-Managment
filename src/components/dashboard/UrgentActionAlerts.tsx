import React from "react";
import { WindowCard } from "../ui/WindowCard";
import Link from "next/link";
import { NeoButton } from "../ui/NeoButton";

interface UrgentActionAlertsProps {
  onRunBillingSweep?: () => void;
  billingLoading?: boolean;
}

export const UrgentActionAlerts: React.FC<UrgentActionAlertsProps> = ({
  onRunBillingSweep,
  billingLoading = false,
}) => {
  return (
    <WindowCard
      title="Urgent Revenue Alerts &amp; Triage"
      icon="warning"
      headerBg="bg-[#FFCCD5]"
      className="lg:col-span-5 flex flex-col"
    >
      <div className="flex flex-col gap-3">
        {/* Alert 1: Overdue Invoices */}
        <div className="p-3 bg-[#FFF2DF] border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-[#FF4D6D] border-2 border-[#1D1E24] text-white flex items-center justify-center font-headline font-black text-[14px]">
              !
            </span>
            <div>
              <div className="font-headline text-[12px] uppercase font-black text-[#1D1E24]">
                14 Invoices Overdue ($9,350 at risk)
              </div>
              <p className="text-[11px] text-[#5B5D68] font-medium">
                Accounts past Net 15 terms requiring collection follow-up.
              </p>
            </div>
          </div>
          <Link href="/invoices?status=overdue">
            <NeoButton variant="destructive" size="sm">
              Chase
            </NeoButton>
          </Link>
        </div>

        {/* Alert 2: Midnight Billing Sweep Simulation */}
        <div className="p-3 bg-[#E0F9FF] border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-[#00C2E8] border-2 border-[#1D1E24] text-[#1D1E24] flex items-center justify-center font-headline font-black text-[14px]">
              ⚡
            </span>
            <div>
              <div className="font-headline text-[12px] uppercase font-black text-[#1D1E24]">
                142 Renewals Due For Invoicing
              </div>
              <p className="text-[11px] text-[#5B5D68] font-medium">
                Automated idempotent billing run ready for midnight execution.
              </p>
            </div>
          </div>
          <NeoButton
            variant="cyan"
            size="sm"
            onClick={onRunBillingSweep}
            disabled={billingLoading}
          >
            {billingLoading ? "Billing..." : "Run Sweep"}
          </NeoButton>
        </div>

        {/* Alert 3: Discount Rule Threshold */}
        <div className="p-3 bg-[#FFF8EE] border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 bg-[#FFD600] border-2 border-[#1D1E24] text-[#1D1E24] flex items-center justify-center font-headline font-black text-[14px]">
              🏷️
            </span>
            <div>
              <div className="font-headline text-[12px] uppercase font-black text-[#1D1E24]">
                Discount &apos;EARLYBIRD15&apos; Cap Warning
              </div>
              <p className="text-[11px] text-[#5B5D68] font-medium">
                Usage at 24/100 claims. Automatic retirement scheduled upon exhaustion.
              </p>
            </div>
          </div>
          <Link href="/discounts">
            <NeoButton variant="secondary" size="sm">
              Review
            </NeoButton>
          </Link>
        </div>
      </div>
    </WindowCard>
  );
};

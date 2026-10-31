import React from "react";
import { WindowCard } from "../ui/WindowCard";
import Link from "next/link";
import { getStatusBadgeStyle } from "@/lib/utils";

interface SubscriptionRow {
  id: string;
  subscriptionNumber: string;
  customerName: string;
  planName: string;
  status: string;
  nextBillingDate: string;
  amount: number;
}

interface RecentSubscriptionsStreamProps {
  subscriptions?: SubscriptionRow[];
}

export const RecentSubscriptionsStream: React.FC<RecentSubscriptionsStreamProps> = ({
  subscriptions = [
    {
      id: "1",
      subscriptionNumber: "SUB-2026-0001",
      customerName: "Acme Industrial Corp",
      planName: "Pro Growth Monthly (Odoo Edition)",
      status: "active",
      nextBillingDate: "Nov 01, 2026",
      amount: 3492.8,
    },
    {
      id: "2",
      subscriptionNumber: "SUB-2026-0002",
      customerName: "NovaTech Cloud Systems",
      planName: "Enterprise Annual Pro",
      status: "active",
      nextBillingDate: "Nov 15, 2026",
      amount: 20740.0,
    },
    {
      id: "3",
      subscriptionNumber: "SUB-2026-0042",
      customerName: "Peak Retail Global",
      planName: "Sprint Weekly Agile",
      status: "quotation",
      nextBillingDate: "Nov 07, 2026",
      amount: 400.0,
    },
    {
      id: "4",
      subscriptionNumber: "SUB-2026-0089",
      customerName: "CloudWave Telemetry",
      planName: "Pro Growth Monthly",
      status: "confirmed",
      nextBillingDate: "Nov 12, 2026",
      amount: 1500.0,
    },
  ],
}) => {
  return (
    <WindowCard
      title="Recent Subscriptions Lifecycle Stream"
      icon="history"
      className="lg:col-span-7 flex flex-col"
      actions={
        <Link
          href="/subscriptions"
          className="px-2 py-0.5 bg-[#FFF8EE] border-2 border-[#1D1E24] font-headline text-[10px] uppercase font-black shadow-[1.5px_1.5px_0px_#1D1E24] hover:bg-[#FFD600]"
        >
          View All (1,842)
        </Link>
      }
    >
      <div className="overflow-x-auto border-2 border-[#1D1E24] shadow-[3px_3px_0px_#1D1E24]">
        <table className="w-full text-left border-collapse text-[12px]">
          <thead>
            <tr className="bg-[#FFF0DC] border-b-2 border-[#1D1E24] font-headline text-[11px] uppercase font-black text-[#1D1E24]">
              <th className="p-2.5">Subscription</th>
              <th className="p-2.5">Customer</th>
              <th className="p-2.5">Plan / SKU</th>
              <th className="p-2.5">Status</th>
              <th className="p-2.5">Next Billing</th>
              <th className="p-2.5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-[#1D1E24]">
            {subscriptions.map((sub) => {
              const badge = getStatusBadgeStyle(sub.status);
              return (
                <tr
                  key={sub.id}
                  className="bg-white hover:bg-[#25F4D2]/20 transition-colors"
                >
                  <td className="p-2.5 font-headline font-black text-[#1D1E24]">
                    <Link
                      href={`/subscriptions?id=${sub.id}`}
                      className="hover:underline text-[#006b5b]"
                    >
                      {sub.subscriptionNumber}
                    </Link>
                  </td>
                  <td className="p-2.5 font-bold text-[#1D1E24]">{sub.customerName}</td>
                  <td className="p-2.5 text-[#34363F] font-medium">{sub.planName}</td>
                  <td className="p-2.5">
                    <span
                      className={`inline-block px-1.5 py-0.5 text-[9px] font-headline uppercase font-black border border-[#1D1E24] shadow-[1px_1px_0px_#1D1E24] ${badge.bg} ${badge.text}`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-2.5 font-headline font-bold text-[11px]">
                    {sub.nextBillingDate}
                  </td>
                  <td className="p-2.5 text-right font-headline font-black text-[#1D1E24]">
                    ${sub.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </WindowCard>
  );
};

import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { prisma } from "@/lib/prisma";
import { PlansClient } from "./PlansClient";

export const dynamic = "force-dynamic";

export default async function PlansPage() {
  const plans = await prisma.plan.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      subscriptions: {
        select: { id: true },
      },
    },
  });

  const serializedPlans = plans.map((p) => ({
    id: p.id,
    name: p.name,
    billingInterval: p.billingInterval,
    baseCost: p.baseCost,
    minQuantity: p.minQuantity,
    autoClose: p.autoClose,
    allowEarlyClosure: p.allowEarlyClosure,
    allowPause: p.allowPause,
    allowRenewal: p.allowRenewal,
    isActive: p.isActive,
    subscriberCount: p.subscriptions.length,
  }));

  return (
    <AppShell>
      <PlansClient initialPlans={serializedPlans} />
    </AppShell>
  );
}


import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { prisma } from "@/lib/prisma";
import { DiscountsClient } from "./DiscountsClient";

export const dynamic = "force-dynamic";

export default async function DiscountsPage() {
  const discounts = await prisma.discount.findMany({
    orderBy: { createdAt: "desc" },
    include: { product: true },
  });

  const serializedDiscounts = discounts.map((d) => ({
    id: d.id,
    code: d.code,
    name: d.name,
    discountType: d.discountType,
    value: d.value,
    minPurchaseAmount: d.minPurchaseAmount,
    minQuantity: d.minQuantity,
    appliesTo: d.appliesTo,
    productName: d.product ? d.product.name : "All Products",
    startDate: d.startDate.toISOString(),
    endDate: d.endDate.toISOString(),
    maxUsageLimit: d.maxUsageLimit,
    currentUsageCount: d.currentUsageCount,
    isActive: d.isActive,
  }));

  return (
    <AppShell>
      <DiscountsClient initialDiscounts={serializedDiscounts} />
    </AppShell>
  );
}


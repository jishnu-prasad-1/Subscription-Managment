import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { WindowCard } from "@/components/ui/WindowCard";
import { NeoButton } from "@/components/ui/NeoButton";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ProductsClient } from "./ProductsClient";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { variants: true },
  });

  const serializedProducts = products.map((p) => ({
    id: p.id,
    name: p.name,
    productType: p.productType,
    salesPrice: p.salesPrice,
    costPrice: p.costPrice,
    notes: p.notes,
    isActive: p.isActive,
    variants: p.variants.map((v) => ({
      id: v.id,
      variantName: v.variantName,
      attributeKey: v.attributeKey,
      attributeValue: v.attributeValue,
      additionalPrice: v.additionalPrice,
    })),
  }));

  return (
    <AppShell>
      <ProductsClient initialProducts={serializedProducts} />
    </AppShell>
  );
}

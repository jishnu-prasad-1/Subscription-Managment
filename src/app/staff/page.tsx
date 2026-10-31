import React from "react";
import { AppShell } from "@/components/layout/AppShell";
import { prisma } from "@/lib/prisma";
import { StaffClient } from "./StaffClient";

export const dynamic = "force-dynamic";

export default async function StaffPage() {
  const staffUsers = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "STAFF"] },
    },
    orderBy: { createdAt: "desc" },
  });

  const serializedStaff = staffUsers.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
  }));

  return (
    <AppShell>
      <StaffClient initialStaff={serializedStaff} />
    </AppShell>
  );
}


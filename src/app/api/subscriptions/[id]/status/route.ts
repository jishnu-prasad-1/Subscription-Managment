import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const validStatuses = ["draft", "quotation", "confirmed", "active", "paused", "closed", "expired"];
    if (!validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: `Invalid status: ${status}` },
        { status: 400 }
      );
    }

    const updated = await prisma.subscription.update({
      where: { id },
      data: { status: status.toLowerCase() },
    });

    // Create audit log entry
    await prisma.auditLog.create({
      data: {
        action: `SUBSCRIPTION_STATUS_${status.toUpperCase()}`,
        entityType: "Subscription",
        entityId: id,
        payload: JSON.stringify({ newStatus: status }),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    console.error("Subscription status update error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Database error" },
      { status: 500 }
    );
  }
}

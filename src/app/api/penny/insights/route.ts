import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const now = new Date();
    const in7Days = new Date(now);
    in7Days.setDate(in7Days.getDate() + 7);

    // 1. Subscription stats
    const [activeCount, totalSubsCount] = await Promise.all([
      prisma.subscription.count({ where: { status: "active" } }),
      prisma.subscription.count(),
    ]);

    const activeSubs = await prisma.subscription.findMany({
      where: { status: "active" },
      select: { totalRecurringAmount: true },
    });
    const mrr = activeSubs.reduce((acc, s) => acc + (s.totalRecurringAmount || 0), 0);

    // 2. Overdue invoices
    const overdueInvoices = await prisma.invoice.findMany({
      where: { status: "overdue" },
      select: { balanceDue: true },
    });
    const overdueCount = overdueInvoices.length;
    const overdueAmount = overdueInvoices.reduce((acc, inv) => acc + (inv.balanceDue || 0), 0);

    // 3. Renewals in next 7 days
    const upcomingRenewalsCount = await prisma.subscription.count({
      where: {
        status: "active",
        nextBillingDate: { lte: in7Days },
      },
    });

    // 4. Pending quotations
    const pendingQuotesCount = await prisma.quotation.count({
      where: { status: { in: ["draft", "sent"] } },
    });

    // 5. Dynamic Smart Mascot Advice
    let mascotMood: "celebrate" | "alert" | "dispatch" | "thinking" = "dispatch";
    let message = "";

    if (overdueCount > 0 && overdueAmount > 5000) {
      mascotMood = "alert";
      message = `Golly! We have ${overdueCount} overdue invoices risking ₹${overdueAmount.toLocaleString()} in uncollected cash. Head over to the Invoices ledger to trigger dunning sweeps!`;
    } else if (upcomingRenewalsCount > 0) {
      mascotMood = "dispatch";
      message = `Heads up! ${upcomingRenewalsCount} subscription renewals are slated for billing in the next 7 days. Our zero double-billing engine is ready.`;
    } else if (pendingQuotesCount > 0) {
      mascotMood = "thinking";
      message = `You have ${pendingQuotesCount} open sales quotations ready for 1-click conversion into confirmed recurring subscriptions.`;
    } else {
      mascotMood = "celebrate";
      message = `All systems nominal! Current MRR is running smooth at ₹${mrr.toLocaleString()} across ${activeCount} active subscriptions.`;
    }

    return NextResponse.json({
      success: true,
      data: {
        activeCount,
        totalSubsCount,
        mrr,
        overdueCount,
        overdueAmount,
        upcomingRenewalsCount,
        pendingQuotesCount,
        mascotMood,
        message,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error: unknown) {
    console.error("Penny telemetry error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate telemetry",
      },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET() {
  try {
    const benchmarkStart = performance.now();

    // 1. Benchmark MRR Aggregation across full database
    const t1 = performance.now();
    const activeSubs = await prisma.subscription.findMany({
      where: { status: "active" },
      select: { totalRecurringAmount: true },
    });
    const mrr = activeSubs.reduce((acc, s) => acc + (s.totalRecurringAmount || 0), 0);
    const mrrAggregationMs = Number((performance.now() - t1).toFixed(2));

    // 2. Benchmark Overdue Invoices Query & Aggregation
    const t2 = performance.now();
    const overdueInvoices = await prisma.invoice.findMany({
      where: { status: "overdue" },
      select: { id: true, balanceDue: true },
    });
    const overdueTotal = overdueInvoices.reduce((acc, inv) => acc + (inv.balanceDue || 0), 0);
    const overdueLookupMs = Number((performance.now() - t2).toFixed(2));

    // 3. Benchmark Indexed Idempotency Key Lookup
    const t3 = performance.now();
    const sampleHash = crypto.createHash("sha256").update("BENCHMARK_PROBE_KEY").digest("hex");
    const idempotencyCheck = await prisma.invoice.findUnique({
      where: { idempotencyKey: sampleHash },
      select: { id: true },
    });
    const idempotencyLookupMs = Number((performance.now() - t3).toFixed(2));

    // 4. Benchmark Deep Relational Join (Subscription + Customer + Plan + Items + Products)
    const t4 = performance.now();
    const sampleJoined = await prisma.subscription.findFirst({
      where: { status: "active" },
      include: {
        customer: true,
        plan: true,
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
    const relationalJoinMs = Number((performance.now() - t4).toFixed(2));

    const totalExecutionMs = Number((performance.now() - benchmarkStart).toFixed(2));
    const totalRecordsScanned = activeSubs.length + overdueInvoices.length;

    const compliance = {
      slaRequirementSeconds: 2.0,
      slaRequirementMs: 2000.0,
      actualLatencyMs: totalExecutionMs,
      performanceDelta: `${Math.round((2000 / totalExecutionMs) * 10) / 10}x faster than Hackathon SLA requirement`,
      passStatus: totalExecutionMs < 2000,
    };

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      compliance,
      metrics: {
        mrrAggregationMs,
        overdueLookupMs,
        idempotencyLookupMs,
        relationalJoinMs,
        totalExecutionMs,
        totalRecordsScanned,
      },
      telemetry: {
        totalMrrComputed: mrr,
        overdueCount: overdueInvoices.length,
        overdueTotal,
        hasSampleRelation: Boolean(sampleJoined),
      },
    });
  } catch (error: unknown) {
    console.error("Benchmark error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Benchmark execution failed",
      },
      { status: 500 }
    );
  }
}


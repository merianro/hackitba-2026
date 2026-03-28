import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateFitScore } from "@/lib/fit-score";
import type { InvestorProfile, AllocationItem } from "@/lib/types";

const allocationSchema = z.object({
  instrumentId: z.string(),
  percentage: z.number().min(0).max(100),
});

const requestSchema = z.object({
  profile: z.object({
    experience: z.enum(["none", "basic", "intermediate", "advanced"]),
    goal: z.enum([
      "short_term_savings",
      "inflation_protection",
      "medium_term_growth",
      "retirement",
      "other",
    ]),
    horizon: z.enum(["less_than_1yr", "1_to_3yr", "more_than_3yr"]),
    riskTolerance: z.enum(["conservative", "moderate", "aggressive"]),
    contributionRule: z.enum(["percentage", "fixed"]),
    contributionAmount: z.number(),
    contributionFrequency: z.enum(["weekly", "biweekly", "monthly"]),
    bankConnected: z.boolean(),
  }),
  allocations: z.array(allocationSchema).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { profile, allocations } = parsed.data;

    const total = allocations.reduce((s, a) => s + a.percentage, 0);
    if (Math.abs(total - 100) > 1) {
      return NextResponse.json(
        { error: "Allocations must sum to 100" },
        { status: 400 }
      );
    }

    const result = calculateFitScore(
      profile as InvestorProfile,
      allocations as AllocationItem[]
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

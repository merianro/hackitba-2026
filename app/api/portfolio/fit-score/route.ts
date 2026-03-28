import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { validateApiKey } from "@/lib/api-auth";
import { calculateFitScore } from "@/lib/fit-score";
import type { InvestorProfile, AllocationItem } from "@/lib/types";

const allocationSchema = z.object({
  instrumentId: z.string(),
  percentage: z.number().min(0).max(100),
});

const requestSchema = z.object({
  profile: z.object({
    experience: z.enum(["none", "basic", "intermediate", "advanced"]),
    goal: z.enum(["short_term", "inflation", "growth", "retirement", "other"]),
    horizon: z.enum(["less_1y", "1_to_3y", "more_3y"]),
    riskTolerance: z.enum(["conservative", "moderate", "aggressive"]),
  }),
  allocations: z.array(allocationSchema).min(1),
});

export async function POST(req: NextRequest) {
  const authError = validateApiKey(req);
  if (authError) return authError;

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

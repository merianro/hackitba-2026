import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateFitScore } from "@/lib/fit-score";
import { buildInsightsPrompt } from "@/lib/ai/prompts";
import { getOpenAIClient } from "@/lib/ai/client";
import { getInstrumentById } from "@/lib/market-data";
import type { InvestorProfile, AllocationItem, PortfolioInsight } from "@/lib/types";
import type { AssetCategory } from "@/lib/types";

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
  allocations: z.array(
    z.object({ instrumentId: z.string(), percentage: z.number() })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { profile, allocations } = parsed.data;
    const fitScore = calculateFitScore(
      profile as InvestorProfile,
      allocations as AllocationItem[]
    );

    const openai = getOpenAIClient();

    if (openai) {
      const prompt = buildInsightsPrompt(
        profile as InvestorProfile,
        allocations as AllocationItem[],
        fitScore
      );

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 600,
        temperature: 0.4,
      });

      const raw = completion.choices[0]?.message?.content ?? "[]";

      try {
        const insights = JSON.parse(raw) as PortfolioInsight[];
        return NextResponse.json({ insights, fitScore, aiGenerated: true });
      } catch {
        // fall through to deterministic
      }
    }

    const insights = generateDeterministicInsights(
      profile as InvestorProfile,
      allocations as AllocationItem[],
      fitScore
    );

    return NextResponse.json({ insights, fitScore, aiGenerated: false });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

function generateDeterministicInsights(
  profile: InvestorProfile,
  allocations: AllocationItem[],
  fitScore: ReturnType<typeof calculateFitScore>
): PortfolioInsight[] {
  const insights: PortfolioInsight[] = [];

  // Category concentrations
  const categoryMap: Partial<Record<AssetCategory, number>> = {};
  for (const alloc of allocations) {
    const inst = getInstrumentById(alloc.instrumentId);
    if (!inst) continue;
    categoryMap[inst.category] = (categoryMap[inst.category] ?? 0) + alloc.percentage;
  }

  const rvPct = categoryMap["renta_variable"] ?? 0;
  const rfPct = categoryMap["renta_fija"] ?? 0;
  const usdPct = categoryMap["dolar"] ?? 0;
  const maxPct = Math.max(...Object.values(categoryMap).map(v => v ?? 0));

  if (maxPct > 60) {
    insights.push({
      type: "warning",
      message:
        "Tu cartera tiene alta concentración en una sola categoría. Considerá diversificar para reducir el riesgo.",
    });
  }

  if (profile.riskTolerance === "conservative" && rvPct > 30) {
    insights.push({
      type: "warning",
      message: `Con un perfil conservador, tu exposición a renta variable (${rvPct}%) es más alta de lo recomendado. Podrías sentirte incómodo ante caídas del mercado.`,
    });
  }

  if (profile.riskTolerance === "aggressive" && rfPct > 60) {
    insights.push({
      type: "info",
      message: `Con perfil agresivo y horizonte largo, tener más del ${rfPct}% en renta fija puede limitar tu potencial de crecimiento.`,
    });
  }

  if (profile.horizon === "less_than_1yr" && rvPct > 15) {
    insights.push({
      type: "warning",
      message:
        "Con un horizonte menor a 1 año, la exposición a activos de alta volatilidad aumenta el riesgo de necesitar rescatar con pérdida.",
    });
  }

  if (usdPct >= 20) {
    insights.push({
      type: "positive",
      message: `Tu cartera tiene un ${usdPct}% en activos dolarizados, lo que brinda protección natural frente a la devaluación.`,
    });
  }

  if (fitScore.score >= 80) {
    insights.push({
      type: "positive",
      message:
        "Tu cartera está bien alineada con tu perfil de inversor. ¡Buen trabajo eligiendo una composición coherente con tus objetivos!",
    });
  }

  if (fitScore.breakdown.diversification < 60) {
    insights.push({
      type: "info",
      message:
        "Agregar más categorías de activos a tu cartera puede mejorar la diversificación y reducir la volatilidad general.",
    });
  }

  // Return at most 3
  return insights.slice(0, 3);
}

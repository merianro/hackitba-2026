import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateFitScore } from "@/lib/fit-score";
import { buildWhatIfPrompt } from "@/lib/ai/prompts";
import { getOpenAIClient } from "@/lib/ai/client";
import {
  computeWeightedReturn,
  computeWeightedVolatility,
} from "@/lib/market-data";
import type { InvestorProfile, AllocationItem, WhatIfScenario } from "@/lib/types";

const profileSchema = z.object({
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
});

const requestSchema = z.object({
  profile: profileSchema,
  allocations: z.array(
    z.object({ instrumentId: z.string(), percentage: z.number() })
  ),
  scenarioId: z.enum(["more_equity", "more_usd", "monthly_contribution"]),
});

const SCENARIOS: Record<
  string,
  {
    label: string;
    description: string;
    transform: (a: AllocationItem[]) => AllocationItem[];
  }
> = {
  more_equity: {
    label: "¿Qué pasa si aumento renta variable?",
    description:
      "Simulamos aumentar la exposición a renta variable al máximo razonable para tu perfil.",
    transform: (allocations: AllocationItem[]) =>
      shiftToCategory(allocations, "rv_acciones", 15),
  },
  more_usd: {
    label: "¿Qué pasa si dolarizo más?",
    description:
      "Simulamos aumentar la exposición a activos en dólares para reducir el riesgo cambiario.",
    transform: (allocations: AllocationItem[]) =>
      shiftToCategory(allocations, "dolar_mep", 15),
  },
  monthly_contribution: {
    label: "¿Qué pasa si aporto fijo mensualmente?",
    description:
      "Simulamos el efecto de mantener aportes regulares durante 12 meses con la cartera actual.",
    transform: (allocations: AllocationItem[]) => allocations,
  },
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { profile, allocations, scenarioId } = parsed.data;
    const scenario = SCENARIOS[scenarioId];

    const originalFitScore = calculateFitScore(
      profile as InvestorProfile,
      allocations as AllocationItem[]
    );
    const originalReturn = computeWeightedReturn(
      allocations as AllocationItem[],
      "oneYear"
    );
    const originalVol = computeWeightedVolatility(allocations as AllocationItem[]);

    const newAllocations = scenario.transform(allocations as AllocationItem[]);
    const newFitScore = calculateFitScore(
      profile as InvestorProfile,
      newAllocations
    );
    const newReturn = computeWeightedReturn(newAllocations, "oneYear");
    const newVol = computeWeightedVolatility(newAllocations);

    let narrative = "";
    const openai = getOpenAIClient();

    if (openai) {
      const prompt = buildWhatIfPrompt(
        profile as InvestorProfile,
        allocations as AllocationItem[],
        originalFitScore,
        scenario.label,
        scenario.description,
        newAllocations,
        newFitScore
      );
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 250,
        temperature: 0.4,
      });
      narrative = completion.choices[0]?.message?.content ?? "";
    }

    if (!narrative) {
      narrative = generateDeterministicNarrative(
        scenarioId,
        originalFitScore.score,
        newFitScore.score,
        newReturn - originalReturn,
        newVol - originalVol
      );
    }

    const result: WhatIfScenario = {
      id: scenarioId,
      label: scenario.label,
      description: scenario.description,
      impact: {
        returnOneYear: parseFloat((newReturn - originalReturn).toFixed(1)),
        volatility: parseFloat((newVol - originalVol).toFixed(2)),
        fitScoreDelta: newFitScore.score - originalFitScore.score,
      },
      narrative,
    };

    return NextResponse.json({
      scenario: result,
      newAllocations,
      newFitScore,
      originalFitScore,
    });
  } catch {
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

function shiftToCategory(
  allocations: AllocationItem[],
  targetId: string,
  shiftPct: number
): AllocationItem[] {
  const existing = allocations.find((a) => a.instrumentId === targetId);
  const others = allocations.filter((a) => a.instrumentId !== targetId);

  const targetCurrent = existing?.percentage ?? 0;
  const targetNew = Math.min(targetCurrent + shiftPct, 60);
  const actualShift = targetNew - targetCurrent;

  if (actualShift <= 0) return allocations;

  // Distribute the reduction proportionally across others
  const othersTotal = others.reduce((s, a) => s + a.percentage, 0);
  const newOthers = others.map((a) => ({
    ...a,
    percentage: Math.max(
      0,
      a.percentage - (a.percentage / othersTotal) * actualShift
    ),
  }));

  const updatedTarget = existing
    ? { ...existing, percentage: targetNew }
    : { instrumentId: targetId, percentage: targetNew };

  const result = existing
    ? [...newOthers, updatedTarget]
    : [...newOthers, updatedTarget];

  // Normalize to 100
  const sum = result.reduce((s, a) => s + a.percentage, 0);
  return result.map((a) => ({
    ...a,
    percentage: parseFloat(((a.percentage / sum) * 100).toFixed(1)),
  }));
}

function generateDeterministicNarrative(
  scenarioId: string,
  originalScore: number,
  newScore: number,
  returnDelta: number,
  volDelta: number
): string {
  const scoreDelta = newScore - originalScore;
  const scoreDir = scoreDelta > 0 ? "mejoraría" : "empeoraría";
  const returnDir = returnDelta > 0 ? "aumentaría" : "disminuiría";
  const volDir = volDelta > 0 ? "subiría" : "bajaría";

  switch (scenarioId) {
    case "more_equity":
      return `Aumentar la exposición a renta variable ${returnDir} el retorno anual esperado en ${Math.abs(returnDelta).toFixed(1)} puntos porcentuales. La volatilidad ${volDir} en ${Math.abs(volDelta).toFixed(1)} pp, lo que implica mayor exposición a fluctuaciones de mercado. Tu Portfolio Fit Score ${scoreDir} ${Math.abs(scoreDelta)} puntos.`;

    case "more_usd":
      return `Dolarizar más tu cartera ${returnDir} el retorno en pesos, pero ofrece mayor protección frente a la devaluación. La volatilidad ${volDir} ligeramente. Tu Portfolio Fit Score ${scoreDir} ${Math.abs(scoreDelta)} puntos respecto a tu perfil actual.`;

    case "monthly_contribution":
      return `Manteniendo aportes regulares durante 12 meses con esta cartera, el efecto del interés compuesto puede incrementar significativamente el capital final. La constancia en los aportes suele impactar más que la selección de activos en el largo plazo.`;

    default:
      return `Este escenario ${scoreDir} tu alineación con el perfil en ${Math.abs(scoreDelta)} puntos.`;
  }
}

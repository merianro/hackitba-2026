import type {
  InvestorProfile,
  AllocationItem,
  FitScoreResult,
  FitLabel,
  AssetCategory,
} from "./types";
import { RISK_NUMERIC, TOLERANCE_NUMERIC, FIT_SCORE_WEIGHTS } from "./constants";
import { getInstrumentById } from "./market-data";

// ─── Main ─────────────────────────────────────────────────────────────────

export function calculateFitScore(
  profile: InvestorProfile,
  allocations: AllocationItem[]
): FitScoreResult {
  const riskAlignment = scoreRiskAlignment(profile, allocations);
  const goalCoherence = scoreGoalCoherence(profile, allocations);
  const diversification = scoreDiversification(allocations);
  const historicalConsistency = scoreHistoricalConsistency(profile, allocations);
  const temporalCoherence = scoreTemporalCoherence(profile, allocations);

  const score = Math.round(
    riskAlignment * FIT_SCORE_WEIGHTS.riskAlignment +
      goalCoherence * FIT_SCORE_WEIGHTS.goalCoherence +
      diversification * FIT_SCORE_WEIGHTS.diversification +
      historicalConsistency * FIT_SCORE_WEIGHTS.historicalConsistency +
      temporalCoherence * FIT_SCORE_WEIGHTS.temporalCoherence
  );

  return {
    score: Math.max(0, Math.min(100, score)),
    label: scoreToLabel(score),
    breakdown: {
      riskAlignment: Math.round(riskAlignment),
      goalCoherence: Math.round(goalCoherence),
      diversification: Math.round(diversification),
      historicalConsistency: Math.round(historicalConsistency),
      temporalCoherence: Math.round(temporalCoherence),
    },
  };
}

// ─── Dimension scorers ────────────────────────────────────────────────────

/**
 * Risk alignment (30%): compare weighted portfolio risk with declared tolerance.
 */
function scoreRiskAlignment(
  profile: InvestorProfile,
  allocations: AllocationItem[]
): number {
  const tolerance = TOLERANCE_NUMERIC[profile.riskTolerance];
  const portfolioRisk = computeWeightedRisk(allocations);
  // Risk diff on 1-3 scale → convert to 0-100
  const diff = Math.abs(portfolioRisk - tolerance);
  if (diff < 0.2) return 100;
  if (diff < 0.5) return 85;
  if (diff < 1.0) return 60;
  if (diff < 1.5) return 35;
  return 10;
}

/**
 * Goal coherence (25%): does the portfolio serve the declared financial goal?
 */
function scoreGoalCoherence(
  profile: InvestorProfile,
  allocations: AllocationItem[]
): number {
  const categoryWeights = computeCategoryWeights(allocations);

  const fixedIncome =
    (categoryWeights["renta_fija"] ?? 0) + (categoryWeights["mixto"] ?? 0) * 0.5;
  const usd = categoryWeights["dolar"] ?? 0;
  const equity =
    (categoryWeights["renta_variable"] ?? 0) +
    (categoryWeights["commodities"] ?? 0);
  const stableTotal = fixedIncome + usd;

  switch (profile.goal) {
    case "short_term_savings":
      // Needs mostly stable assets
      return clamp(stableTotal * 1.1, 0, 100);

    case "inflation_protection":
      // USD + equity are the best hedge
      return clamp((usd + equity) * 1.1, 0, 100);

    case "medium_term_growth":
      // Balanced: moderate equity exposure is good
      if (equity >= 20 && equity <= 60) return 100;
      if (equity > 60) return clamp(100 - (equity - 60) * 2, 0, 100);
      return clamp(60 + equity, 0, 100);

    case "retirement":
      // Long-term: diversified with growth bias is ideal
      if (equity >= 30 && stableTotal >= 20) return 100;
      if (equity < 30) return clamp(50 + equity, 0, 100);
      return 75;

    case "other":
    default:
      return 70;
  }
}

/**
 * Diversification (20%): more categories used = better. Penalizes concentration.
 */
function scoreDiversification(allocations: AllocationItem[]): number {
  const categoryWeights = computeCategoryWeights(allocations);
  const categoriesUsed = Object.keys(categoryWeights).filter(
    (c) => categoryWeights[c as AssetCategory]! > 0
  ).length;
  const totalCategories = 5;

  const categoryScore = (categoriesUsed / totalCategories) * 60;

  // Penalize heavy concentration in a single category
  const maxWeight = Math.max(...Object.values(categoryWeights));
  let concentrationPenalty = 0;
  if (maxWeight > 70) concentrationPenalty = 40;
  else if (maxWeight > 55) concentrationPenalty = 20;
  else if (maxWeight > 40) concentrationPenalty = 8;

  // Penalize single instrument concentration
  const maxInstrumentPct = Math.max(...allocations.map((a) => a.percentage));
  if (maxInstrumentPct > 50) concentrationPenalty += 20;
  else if (maxInstrumentPct > 40) concentrationPenalty += 10;

  return clamp(categoryScore + 40 - concentrationPenalty, 0, 100);
}

/**
 * Historical consistency (15%): weighted volatility vs declared risk tolerance.
 */
function scoreHistoricalConsistency(
  profile: InvestorProfile,
  allocations: AllocationItem[]
): number {
  const volatility = computeWeightedVolatility(allocations);
  const toleranceMaxVol: Record<string, number> = {
    conservative: 5,
    moderate: 12,
    aggressive: 25,
  };
  const maxVol = toleranceMaxVol[profile.riskTolerance];

  if (volatility <= maxVol * 0.7) return 90;
  if (volatility <= maxVol) return 100;
  const excess = volatility - maxVol;
  return clamp(100 - excess * 8, 0, 100);
}

/**
 * Temporal coherence (10%): is the portfolio risk appropriate for the time horizon?
 */
function scoreTemporalCoherence(
  profile: InvestorProfile,
  allocations: AllocationItem[]
): number {
  const portfolioRisk = computeWeightedRisk(allocations);
  const horizonMap: Record<string, number> = {
    less_than_1yr: 1,
    "1_to_3yr": 1.8,
    more_than_3yr: 3,
  };
  const horizon = horizonMap[profile.horizon];

  // Short horizon → should be low risk
  if (profile.horizon === "less_than_1yr") {
    if (portfolioRisk <= 1.3) return 100;
    if (portfolioRisk <= 1.8) return 70;
    return 30;
  }

  // Long horizon → having some higher risk is fine
  if (profile.horizon === "more_than_3yr") {
    if (portfolioRisk >= 1.8) return 100;
    return clamp(portfolioRisk * 50, 0, 100);
  }

  // Medium: balanced
  const diff = Math.abs(portfolioRisk - horizon);
  return clamp(100 - diff * 25, 0, 100);
}

// ─── Helpers ──────────────────────────────────────────────────────────────

function computeWeightedRisk(allocations: AllocationItem[]): number {
  return allocations.reduce((total, alloc) => {
    const instrument = getInstrumentById(alloc.instrumentId);
    if (!instrument) return total;
    return total + RISK_NUMERIC[instrument.riskLevel] * (alloc.percentage / 100);
  }, 0);
}

function computeWeightedVolatility(allocations: AllocationItem[]): number {
  return allocations.reduce((total, alloc) => {
    const instrument = getInstrumentById(alloc.instrumentId);
    if (!instrument) return total;
    return total + instrument.volatility * (alloc.percentage / 100);
  }, 0);
}

function computeCategoryWeights(
  allocations: AllocationItem[]
): Partial<Record<AssetCategory, number>> {
  const result: Partial<Record<AssetCategory, number>> = {};
  for (const alloc of allocations) {
    const instrument = getInstrumentById(alloc.instrumentId);
    if (!instrument) continue;
    result[instrument.category] =
      (result[instrument.category] ?? 0) + alloc.percentage;
  }
  return result;
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function scoreToLabel(score: number): FitLabel {
  if (score >= 85) return "Muy alineado";
  if (score >= 65) return "Alineado";
  if (score >= 45) return "Moderadamente fuera de perfil";
  return "Fuera de perfil";
}

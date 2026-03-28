import type { InvestorProfile, AllocationItem, Portfolio } from "./types";
import { getAllInstruments } from "./market-data";

/**
 * Generates a suggested portfolio based on the investor profile using
 * deterministic rules. No randomness — same profile always yields same result.
 */
export function suggestPortfolio(profile: InvestorProfile): Portfolio {
  const { riskTolerance, goal, horizon } = profile;

  // Conservative profiles
  if (riskTolerance === "conservative") {
    if (goal === "short_term_savings" || horizon === "less_than_1yr") {
      return makePortfolio([
        { instrumentId: "mm_ars", percentage: 50 },
        { instrumentId: "dolar_mep", percentage: 35 },
        { instrumentId: "rf_soberana", percentage: 15 },
      ]);
    }
    return makePortfolio([
      { instrumentId: "mm_ars", percentage: 35 },
      { instrumentId: "dolar_mep", percentage: 30 },
      { instrumentId: "on_usd", percentage: 20 },
      { instrumentId: "rf_soberana", percentage: 15 },
    ]);
  }

  // Moderate profiles
  if (riskTolerance === "moderate") {
    if (goal === "inflation_protection") {
      return makePortfolio([
        { instrumentId: "dolar_mep", percentage: 30 },
        { instrumentId: "on_usd", percentage: 20 },
        { instrumentId: "fci_mixto", percentage: 25 },
        { instrumentId: "mm_ars", percentage: 15 },
        { instrumentId: "cedears", percentage: 10 },
      ]);
    }
    return makePortfolio([
      { instrumentId: "fci_mixto", percentage: 30 },
      { instrumentId: "cedears", percentage: 20 },
      { instrumentId: "dolar_mep", percentage: 20 },
      { instrumentId: "mm_ars", percentage: 15 },
      { instrumentId: "on_usd", percentage: 15 },
    ]);
  }

  // Aggressive profiles
  if (goal === "retirement" && horizon === "more_than_3yr") {
    return makePortfolio([
      { instrumentId: "cedears", percentage: 35 },
      { instrumentId: "rv_acciones", percentage: 25 },
      { instrumentId: "commodities", percentage: 15 },
      { instrumentId: "fci_mixto", percentage: 15 },
      { instrumentId: "dolar_mep", percentage: 10 },
    ]);
  }

  return makePortfolio([
    { instrumentId: "rv_acciones", percentage: 30 },
    { instrumentId: "cedears", percentage: 30 },
    { instrumentId: "fci_mixto", percentage: 20 },
    { instrumentId: "commodities", percentage: 10 },
    { instrumentId: "dolar_mep", percentage: 10 },
  ]);
}

function makePortfolio(allocations: AllocationItem[]): Portfolio {
  const total = allocations.reduce((s, a) => s + a.percentage, 0);
  if (Math.abs(total - 100) > 0.01) {
    throw new Error(`Allocations sum to ${total}, expected 100`);
  }
  return { allocations, source: "suggested" };
}

/** Returns list of all instrument IDs for building the full UI selector */
export function getAllInstrumentIds(): string[] {
  return getAllInstruments().map((i) => i.id);
}

/** Normalizes allocations so percentages sum to exactly 100 */
export function normalizeAllocations(
  allocations: AllocationItem[]
): AllocationItem[] {
  const total = allocations.reduce((s, a) => s + a.percentage, 0);
  if (total === 0) return allocations;
  return allocations.map((a) => ({
    ...a,
    percentage: Math.round((a.percentage / total) * 100),
  }));
}

import type { InvestorProfile, RiskTolerance, TimeHorizon, InvestmentGoal } from "./types";

/**
 * Derives a risk tolerance suggestion from the combination of stated goal
 * and horizon. Used as a soft cross-validation, not enforcement.
 */
export function deriveRecommendedRisk(
  goal: InvestmentGoal,
  horizon: TimeHorizon
): RiskTolerance {
  if (horizon === "less_than_1yr") return "conservative";
  if (horizon === "1_to_3yr") {
    if (goal === "short_term_savings") return "conservative";
    return "moderate";
  }
  // more_than_3yr
  if (goal === "retirement" || goal === "medium_term_growth") return "aggressive";
  return "moderate";
}

/**
 * Returns a human-readable summary of the investor profile.
 */
export function profileSummary(profile: InvestorProfile): string {
  const horizonMap: Record<string, string> = {
    less_than_1yr: "menos de 1 año",
    "1_to_3yr": "1 a 3 años",
    more_than_3yr: "más de 3 años",
  };
  const goalMap: Record<string, string> = {
    short_term_savings: "ahorro de corto plazo",
    inflation_protection: "protección contra la inflación",
    medium_term_growth: "crecimiento de mediano plazo",
    retirement: "planificación de jubilación",
    other: "un objetivo personal",
  };
  const riskMap: Record<string, string> = {
    conservative: "conservador",
    moderate: "moderado",
    aggressive: "agresivo",
  };

  return (
    `Perfil ${riskMap[profile.riskTolerance]}, con horizonte de ` +
    `${horizonMap[profile.horizon]}, orientado a ${goalMap[profile.goal]}.`
  );
}

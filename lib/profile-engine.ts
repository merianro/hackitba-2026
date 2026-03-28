import type { InvestorProfile, RiskTolerance, TimeHorizon, InvestmentGoal } from "./types";

/**
 * Derives a risk tolerance suggestion from the combination of stated goal
 * and horizon. Used as a soft cross-validation, not enforcement.
 */
export function deriveRecommendedRisk(
  goal: InvestmentGoal,
  horizon: TimeHorizon
): RiskTolerance {
  if (horizon === "less_1y") return "conservative";
  if (horizon === "1_to_3y") {
    if (goal === "short_term") return "conservative";
    return "moderate";
  }
  // more_3y
  if (goal === "retirement" || goal === "growth") return "aggressive";
  return "moderate";
}

/**
 * Returns a human-readable summary of the investor profile.
 */
export function profileSummary(profile: InvestorProfile): string {
  const horizonMap: Record<string, string> = {
    less_1y: "menos de 1 año",
    "1_to_3y": "1 a 3 años",
    more_3y: "más de 3 años",
  };
  const goalMap: Record<string, string> = {
    short_term: "ahorro de corto plazo",
    inflation: "protección contra la inflación",
    growth: "crecimiento",
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

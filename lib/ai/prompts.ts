import type { InvestorProfile, AllocationItem, FitScoreResult } from "../types";
import { GOAL_LABELS, HORIZON_LABELS, RISK_LABELS, CATEGORY_LABELS } from "../constants";
import { getInstrumentById } from "../market-data";

function formatAllocations(allocations: AllocationItem[]): string {
  return allocations
    .map((a) => {
      const inst = getInstrumentById(a.instrumentId);
      return inst ? `- ${inst.name} (${CATEGORY_LABELS[inst.category]}): ${a.percentage}%` : "";
    })
    .filter(Boolean)
    .join("\n");
}

export function buildInsightsPrompt(
  profile: InvestorProfile,
  allocations: AllocationItem[],
  fitScore: FitScoreResult
): string {
  return `Sos un asesor financiero que habla en español rioplatense, claro y sin jerga técnica.

Perfil del inversor:
- Objetivo: ${GOAL_LABELS[profile.goal]}
- Horizonte: ${HORIZON_LABELS[profile.horizon]}
- Tolerancia al riesgo: ${RISK_LABELS[profile.riskTolerance]}
- Experiencia: ${profile.experience}

Cartera actual:
${formatAllocations(allocations)}

Portfolio Fit Score: ${fitScore.score}/100 (${fitScore.label})
- Alineación de riesgo: ${fitScore.breakdown.riskAlignment}/100
- Coherencia con objetivo: ${fitScore.breakdown.goalCoherence}/100
- Diversificación: ${fitScore.breakdown.diversification}/100
- Consistencia histórica: ${fitScore.breakdown.historicalConsistency}/100
- Coherencia temporal: ${fitScore.breakdown.temporalCoherence}/100

Generá exactamente 3 insights concisos (máximo 2 oraciones cada uno) sobre esta cartera. 
Cada insight debe ser accionable y mencionar qué puede mejorar o qué está bien.
Respondé SOLO con un JSON array con este formato exacto:
[
  { "type": "warning" | "info" | "positive", "message": "texto del insight" },
  ...
]
No agregues texto fuera del JSON.`;
}

export function buildWhatIfPrompt(
  profile: InvestorProfile,
  allocations: AllocationItem[],
  fitScore: FitScoreResult,
  scenarioLabel: string,
  scenarioDescription: string,
  newAllocations: AllocationItem[],
  newFitScore: FitScoreResult
): string {
  return `Sos un asesor financiero que habla en español rioplatense, claro y sin jerga técnica.

Perfil del inversor:
- Objetivo: ${GOAL_LABELS[profile.goal]}
- Horizonte: ${HORIZON_LABELS[profile.horizon]}
- Tolerancia al riesgo: ${RISK_LABELS[profile.riskTolerance]}

Cartera original (Fit Score: ${fitScore.score}/100):
${formatAllocations(allocations)}

Escenario simulado: "${scenarioLabel}"
Descripción: ${scenarioDescription}

Cartera hipotética (Fit Score: ${newFitScore.score}/100):
${formatAllocations(newAllocations)}

Explicá en 2-3 oraciones qué implica este cambio para este inversor específicamente.
Mencioná impacto en riesgo, rendimiento esperado y si mejora o empeora la coherencia con su perfil.
Respondé SOLO con texto plano, sin JSON, sin listas, sin markdown.`;
}

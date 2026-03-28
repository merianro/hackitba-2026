import type {
  Experience,
  InvestmentGoal,
  TimeHorizon,
  RiskTolerance,
  ContributionFrequency,
  AssetCategory,
  RiskLevel,
} from "./types";

// ─── Labels ──────────────────────────────────────────────────────────────

export const EXPERIENCE_LABELS: Record<Experience, string> = {
  none: "Sin experiencia previa",
  basic: "Conozco los conceptos básicos",
  intermediate: "Ya invertí alguna vez",
  advanced: "Invierto regularmente",
};

export const GOAL_LABELS: Record<InvestmentGoal, string> = {
  short_term: "Ahorrar a corto plazo",
  inflation: "Protegerme de la inflación",
  growth: "Hacer crecer mi dinero",
  retirement: "Planificar mi jubilación",
  other: "Otro objetivo",
};

export const HORIZON_LABELS: Record<TimeHorizon, string> = {
  less_1y: "Menos de 1 año",
  "1_to_3y": "Entre 1 y 3 años",
  more_3y: "Más de 3 años",
};

export const RISK_LABELS: Record<RiskTolerance, string> = {
  conservative: "Conservador — prefiero estabilidad",
  moderate: "Moderado — acepto algo de volatilidad",
  aggressive: "Agresivo — busco máximo crecimiento",
};

export const FREQUENCY_LABELS: Record<ContributionFrequency, string> = {
  weekly: "Semanal",
  biweekly: "Quincenal",
  monthly: "Mensual",
};

export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  renta_fija: "Renta Fija",
  renta_variable: "Renta Variable",
  dolar: "Dólar / USD",
  mixto: "Mixto",
  commodities: "Commodities",
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  low: "Bajo",
  medium: "Medio",
  high: "Alto",
};

// ─── Fit Score Weights ────────────────────────────────────────────────────

export const FIT_SCORE_WEIGHTS = {
  riskAlignment: 0.30,
  goalCoherence: 0.25,
  diversification: 0.20,
  historicalConsistency: 0.15,
  temporalCoherence: 0.10,
} as const;

// ─── Risk numeric mapping ─────────────────────────────────────────────────

export const RISK_NUMERIC: Record<RiskLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

export const TOLERANCE_NUMERIC: Record<RiskTolerance, number> = {
  conservative: 1,
  moderate: 2,
  aggressive: 3,
};

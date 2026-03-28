import type { InvestorProfile, Portfolio, FitScoreResult } from "./types";

const KEYS = {
  profile: "spb_profile",
  portfolio: "spb_portfolio",
  fitScore: "spb_fit_score",
} as const;

function isBrowser() {
  return typeof window !== "undefined";
}

function save<T>(key: string, value: T): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable
  }
}

function load<T>(key: string): T | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function remove(key: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export const storage = {
  saveProfile: (profile: InvestorProfile) => save(KEYS.profile, profile),
  loadProfile: () => load<InvestorProfile>(KEYS.profile),
  clearProfile: () => remove(KEYS.profile),

  savePortfolio: (portfolio: Portfolio) => save(KEYS.portfolio, portfolio),
  loadPortfolio: () => load<Portfolio>(KEYS.portfolio),
  clearPortfolio: () => remove(KEYS.portfolio),

  saveFitScore: (result: FitScoreResult) => save(KEYS.fitScore, result),
  loadFitScore: () => load<FitScoreResult>(KEYS.fitScore),
  clearFitScore: () => remove(KEYS.fitScore),

  clearAll: () => {
    remove(KEYS.profile);
    remove(KEYS.portfolio);
    remove(KEYS.fitScore);
  },
};

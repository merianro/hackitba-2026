-- ============================================================
-- HackITBA 2026 — Initial schema
-- ============================================================

-- Enums
CREATE TYPE conversation_role AS ENUM ('user', 'assistant');
CREATE TYPE experience_level  AS ENUM ('none', 'basic', 'intermediate', 'advanced');
CREATE TYPE investment_goal   AS ENUM ('short_term', 'inflation', 'growth', 'retirement', 'other');
CREATE TYPE time_horizon      AS ENUM ('less_1y', '1_to_3y', 'more_3y');
CREATE TYPE risk_tolerance    AS ENUM ('conservative', 'moderate', 'aggressive');
CREATE TYPE asset_category    AS ENUM ('renta_fija', 'renta_variable', 'dolar', 'mixto', 'commodities');
CREATE TYPE risk_level        AS ENUM ('low', 'medium', 'high');
CREATE TYPE portfolio_status  AS ENUM ('draft', 'active', 'archived');
CREATE TYPE contribution_type AS ENUM ('percentage', 'fixed');
CREATE TYPE contribution_freq AS ENUM ('weekly', 'biweekly', 'monthly');
CREATE TYPE contribution_st   AS ENUM ('simulated', 'pending');

-- ─── users ────────────────────────────────────────────────────────────────
CREATE TABLE users (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone      text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── conversation_history ─────────────────────────────────────────────────
CREATE TABLE conversation_history (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role       conversation_role NOT NULL,
  content    text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_conversation_user ON conversation_history(user_id, created_at DESC);

-- ─── investor_profiles ───────────────────────────────────────────────────
CREATE TABLE investor_profiles (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  experience      experience_level NOT NULL,
  goal            investment_goal NOT NULL,
  horizon         time_horizon NOT NULL,
  risk_tolerance  risk_tolerance NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- ─── instruments ─────────────────────────────────────────────────────────
CREATE TABLE instruments (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  ticker     text,
  category   asset_category NOT NULL,
  risk_level risk_level NOT NULL,
  return_1m  numeric NOT NULL,
  return_3m  numeric NOT NULL,
  return_1y  numeric NOT NULL,
  volatility numeric NOT NULL,
  is_active  boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ─── portfolios ──────────────────────────────────────────────────────────
CREATE TABLE portfolios (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                 uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name                    text NOT NULL,
  fit_score               numeric,
  status                  portfolio_status NOT NULL DEFAULT 'draft',
  is_suggested            boolean NOT NULL DEFAULT false,
  contribution_amount     numeric,
  contribution_type       contribution_type,
  contribution_frequency  contribution_freq,
  next_contribution_date  date,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_portfolio_user_status ON portfolios(user_id, status);

-- ─── portfolio_instruments ───────────────────────────────────────────────
CREATE TABLE portfolio_instruments (
  portfolio_id  uuid NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  instrument_id uuid NOT NULL REFERENCES instruments(id) ON DELETE CASCADE,
  percentage    numeric NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  PRIMARY KEY (portfolio_id, instrument_id)
);

-- ─── contribution_history ────────────────────────────────────────────────
CREATE TABLE contribution_history (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_id uuid NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
  amount       numeric NOT NULL,
  executed_at  timestamptz NOT NULL DEFAULT now(),
  status       contribution_st NOT NULL DEFAULT 'simulated'
);
CREATE INDEX idx_contribution_portfolio ON contribution_history(portfolio_id, executed_at DESC);

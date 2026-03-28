-- ============================================================
-- HackITBA 2026 — Seed data
-- ============================================================

-- ─── Instruments ─────────────────────────────────────────────────────────
INSERT INTO instruments (id, name, ticker, category, risk_level, return_1m, return_3m, return_1y, volatility) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'FCI Money Market',             'MM_ARS',   'renta_fija',     'low',    7.2,  22.0,  98.0,   0.4),
  ('a1000000-0000-0000-0000-000000000002', 'Renta Fija Soberana',          'RF_SOB',   'renta_fija',     'medium', 8.5,  27.0, 115.0,   4.2),
  ('a1000000-0000-0000-0000-000000000003', 'FCI Dólar MEP',               'USD_MEP',  'dolar',          'low',    0.6,   1.9,   7.5,   1.8),
  ('a1000000-0000-0000-0000-000000000004', 'Obligaciones Negociables USD', 'ON_USD',   'dolar',          'medium', 0.9,   2.8,  11.5,   3.1),
  ('a1000000-0000-0000-0000-000000000005', 'FCI Mixto Equilibrado',       'MIX_EQ',   'mixto',          'medium', 9.2,  30.0, 128.0,   6.8),
  ('a1000000-0000-0000-0000-000000000006', 'Acciones Argentinas',          'RV_AR',    'renta_variable', 'high',  12.0,  40.0, 165.0,  18.5),
  ('a1000000-0000-0000-0000-000000000007', 'CEDEARs Diversificados',      'CEDEARS',  'renta_variable', 'high',   4.5,  14.0,  62.0,  14.2),
  ('a1000000-0000-0000-0000-000000000008', 'Commodities & Agro',          'COMM_AG',  'commodities',    'high',   3.2,  10.5,  44.0,  16.0);

-- ─── Mock user for dashboard MVP ────────────────────────────────────────
INSERT INTO users (id, phone, email, password) VALUES
  ('b1000000-0000-0000-0000-000000000001', '+5491100000000', 'demo@hackitba.com', 'demo123');

INSERT INTO investor_profiles (user_id, experience, goal, horizon, risk_tolerance) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'basic', 'growth', '1_to_3y', 'moderate');

INSERT INTO portfolios (id, user_id, name, fit_score, status, is_suggested, contribution_amount, contribution_type, contribution_frequency, next_contribution_date) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Cartera Moderada', 78, 'active', true, 50000, 'fixed', 'monthly', '2026-04-01');

INSERT INTO portfolio_instruments (portfolio_id, instrument_id, percentage) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000005', 30),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000007', 20),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 20),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 15),
  ('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', 15);

-- ─── Mock contribution history ──────────────────────────────────────────
INSERT INTO contribution_history (portfolio_id, amount, executed_at, status) VALUES
  ('c1000000-0000-0000-0000-000000000001', 50000, '2026-03-01 09:00:00-03', 'simulated'),
  ('c1000000-0000-0000-0000-000000000001', 50000, '2026-02-01 09:00:00-03', 'simulated'),
  ('c1000000-0000-0000-0000-000000000001', 50000, '2026-01-01 09:00:00-03', 'simulated');

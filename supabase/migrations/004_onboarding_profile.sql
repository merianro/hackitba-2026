-- Add onboarding fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS investor_profile text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_score numeric;

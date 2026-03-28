-- Mock auth: plain-text email/password for MVP demo
ALTER TABLE users ADD COLUMN email text UNIQUE;
ALTER TABLE users ADD COLUMN password text;

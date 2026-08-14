-- Schema e tabela de contatos (landing).
-- Execute no SQL Editor do Supabase (produção) ou via `supabase db reset` (local).
--
-- Depois: Dashboard → Settings → API → "Exposed schemas" → incluir `cagtech`.

CREATE SCHEMA IF NOT EXISTS cagtech;

CREATE TABLE IF NOT EXISTS cagtech.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  reason text,
  budget numeric,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- PostgREST / API: roles do Supabase precisam de USAGE no schema e direitos na tabela.
GRANT USAGE ON SCHEMA cagtech TO postgres, anon, authenticated, service_role;

GRANT ALL ON ALL TABLES IN SCHEMA cagtech TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA cagtech TO anon, authenticated;

GRANT ALL ON ALL SEQUENCES IN SCHEMA cagtech TO postgres, service_role;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA cagtech TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA cagtech
  GRANT ALL ON TABLES TO postgres, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA cagtech
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA cagtech
  GRANT ALL ON SEQUENCES TO postgres, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA cagtech
  GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;

-- RLS (recomendado): só INSERT anônimo na landing; leitura só com service_role / painel futuro.
ALTER TABLE cagtech.contacts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS contacts_insert_anon ON cagtech.contacts;
CREATE POLICY contacts_insert_anon ON cagtech.contacts
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Opcional: negar SELECT para anon (dados só no servidor com service_role).
DROP POLICY IF EXISTS contacts_select_service ON cagtech.contacts;
CREATE POLICY contacts_select_service ON cagtech.contacts
  FOR SELECT
  TO service_role
  USING (true);

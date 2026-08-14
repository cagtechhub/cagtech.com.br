-- Configurações do site (SEO, contato, analytics) + índice para listagem de contatos.
-- Execute no SQL Editor do Supabase após 001_cagtech_contacts.sql.
-- Schema `cagtech` precisa estar em Settings → API → Exposed schemas.

CREATE TABLE IF NOT EXISTS cagtech.site_settings (
  id text PRIMARY KEY DEFAULT 'default',
  site_url text NOT NULL DEFAULT '',
  site_name text NOT NULL DEFAULT 'CAG Tech',
  seo_locality text NOT NULL DEFAULT 'Campo Grande, MS',
  no_index boolean NOT NULL DEFAULT false,
  business_address text NOT NULL DEFAULT '',
  business_phone text NOT NULL DEFAULT '',
  contact_email text NOT NULL DEFAULT '',
  whatsapp_number text NOT NULL DEFAULT '',
  whatsapp_message text NOT NULL DEFAULT '',
  instagram_url text NOT NULL DEFAULT '',
  facebook_url text NOT NULL DEFAULT '',
  linkedin_url text NOT NULL DEFAULT '',
  default_og_image_url text NOT NULL DEFAULT '/og-default.png',
  ga4_measurement_id text NOT NULL DEFAULT '',
  meta_pixel_id text NOT NULL DEFAULT '',
  google_adsense_account text NOT NULL DEFAULT '',
  maps_embed_url text NOT NULL DEFAULT '',
  geo_latitude text NOT NULL DEFAULT '',
  geo_longitude text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS contacts_created_at_idx ON cagtech.contacts (created_at DESC);

INSERT INTO cagtech.site_settings (id, site_name, seo_locality, default_og_image_url)
VALUES ('default', 'CAG Tech', 'Campo Grande, MS', '/og-default.png')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE cagtech.site_settings ENABLE ROW LEVEL SECURITY;

-- Acesso só via Nitro (service_role). Anon/authenticated não leem nem gravam direto no PostgREST.
DROP POLICY IF EXISTS site_settings_service_all ON cagtech.site_settings;
CREATE POLICY site_settings_service_all ON cagtech.site_settings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS contacts_select_authenticated ON cagtech.contacts;
CREATE POLICY contacts_select_authenticated ON cagtech.contacts
  FOR SELECT
  TO authenticated
  USING (true);

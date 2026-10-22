-- AlterTable site_settings
ALTER TABLE "cagtech"."site_settings" ADD COLUMN IF NOT EXISTS "cnpj" TEXT NOT NULL DEFAULT '';
ALTER TABLE "cagtech"."site_settings" ADD COLUMN IF NOT EXISTS "contact_project_types" JSONB NOT NULL DEFAULT '["Sistema Web / SaaS", "Aplicativo Mobile", "Integração & APIs", "Squad Dedicado"]';
ALTER TABLE "cagtech"."site_settings" ADD COLUMN IF NOT EXISTS "contact_budget_ranges" JSONB NOT NULL DEFAULT '["Até R$ 20.000 (MVP / Escopo pontual)", "R$ 20.000 a R$ 50.000 (Sistema sob medida)", "R$ 50.000 a R$ 120.000 (Plataforma complexa / Escala)", "Acima de R$ 120.000 / Squad Dedicado contínuo"]';

-- AlterTable projects
ALTER TABLE "cagtech"."projects" ADD COLUMN IF NOT EXISTS "description" TEXT NOT NULL DEFAULT '';
ALTER TABLE "cagtech"."projects" ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'Sistemas Web';
ALTER TABLE "cagtech"."projects" ADD COLUMN IF NOT EXISTS "gallery" JSONB NOT NULL DEFAULT '[]';

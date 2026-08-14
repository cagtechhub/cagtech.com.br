-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "cagtech";

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "cagtech"."LeadStatus" AS ENUM ('novo', 'conversa', 'proposta', 'ganho', 'perdido');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- CreateTable contacts (legacy-compatible)
CREATE TABLE IF NOT EXISTS "cagtech"."contacts" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "reason" TEXT,
    "budget" DECIMAL(12,2),
    "message" TEXT,
    "status" "cagtech"."LeadStatus" NOT NULL DEFAULT 'novo',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "cagtech"."contacts" ADD COLUMN IF NOT EXISTS "status" "cagtech"."LeadStatus" NOT NULL DEFAULT 'novo';
ALTER TABLE "cagtech"."contacts" ADD COLUMN IF NOT EXISTS "sort_order" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "cagtech"."contacts" ADD COLUMN IF NOT EXISTS "notes" TEXT;
ALTER TABLE "cagtech"."contacts" ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP;

CREATE INDEX IF NOT EXISTS "contacts_created_at_idx" ON "cagtech"."contacts"("created_at" DESC);
CREATE INDEX IF NOT EXISTS "contacts_status_idx" ON "cagtech"."contacts"("status");

CREATE TABLE IF NOT EXISTS "cagtech"."site_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "site_url" TEXT NOT NULL DEFAULT '',
    "site_name" TEXT NOT NULL DEFAULT 'CAG Tech',
    "seo_locality" TEXT NOT NULL DEFAULT 'Campo Grande, MS',
    "no_index" BOOLEAN NOT NULL DEFAULT false,
    "business_address" TEXT NOT NULL DEFAULT '',
    "business_phone" TEXT NOT NULL DEFAULT '',
    "contact_email" TEXT NOT NULL DEFAULT '',
    "whatsapp_number" TEXT NOT NULL DEFAULT '',
    "whatsapp_message" TEXT NOT NULL DEFAULT '',
    "instagram_url" TEXT NOT NULL DEFAULT '',
    "facebook_url" TEXT NOT NULL DEFAULT '',
    "linkedin_url" TEXT NOT NULL DEFAULT '',
    "default_og_image_url" TEXT NOT NULL DEFAULT '/og-default.png',
    "ga4_measurement_id" TEXT NOT NULL DEFAULT '',
    "meta_pixel_id" TEXT NOT NULL DEFAULT '',
    "google_adsense_account" TEXT NOT NULL DEFAULT '',
    "maps_embed_url" TEXT NOT NULL DEFAULT '',
    "geo_latitude" TEXT NOT NULL DEFAULT '',
    "geo_longitude" TEXT NOT NULL DEFAULT '',
    "packages_intro_title" TEXT NOT NULL DEFAULT '',
    "packages_intro_body" TEXT NOT NULL DEFAULT '',
    "initial_project_title" TEXT NOT NULL DEFAULT '',
    "initial_project_lead" TEXT NOT NULL DEFAULT '',
    "initial_project_bullets" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "cagtech"."site_settings" ADD COLUMN IF NOT EXISTS "packages_intro_title" TEXT NOT NULL DEFAULT '';
ALTER TABLE "cagtech"."site_settings" ADD COLUMN IF NOT EXISTS "packages_intro_body" TEXT NOT NULL DEFAULT '';
ALTER TABLE "cagtech"."site_settings" ADD COLUMN IF NOT EXISTS "initial_project_title" TEXT NOT NULL DEFAULT '';
ALTER TABLE "cagtech"."site_settings" ADD COLUMN IF NOT EXISTS "initial_project_lead" TEXT NOT NULL DEFAULT '';
ALTER TABLE "cagtech"."site_settings" ADD COLUMN IF NOT EXISTS "initial_project_bullets" JSONB NOT NULL DEFAULT '[]';

INSERT INTO "cagtech"."site_settings" (
  "id", "site_name", "seo_locality", "default_og_image_url",
  "packages_intro_title", "packages_intro_body",
  "initial_project_title", "initial_project_lead", "initial_project_bullets"
) VALUES (
  'default',
  'CAG Tech',
  'Campo Grande, MS',
  '/og-default.png',
  'Pacotes e investimento',
  'Escolha o ponto de partida; todos podem evoluir conforme sua operação cresce. Valores marcados como referência devem ser confirmados na proposta após briefing.',
  'Projeto inicial em parceria',
  'Para o primeiro ciclo, trabalhamos como extensão do seu time: alinhamos escopo técnico, operamos a infraestrutura mínima e conduzimos a gestão do projeto até a entrega.',
  '["Suporte na definição e registro de domínio","Hospedagem em VPS com mensalidade e monitoração básica","Gestão de projeto: ritos, priorização e transparência de entregas","Documentação e handoff para sua equipe evoluir o software depois do go-live"]'::jsonb
)
ON CONFLICT ("id") DO NOTHING;

CREATE TABLE IF NOT EXISTS "cagtech"."packages" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL DEFAULT '',
    "price_display" TEXT NOT NULL,
    "price_footnote" TEXT,
    "includes" JSONB NOT NULL DEFAULT '[]',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "packages_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "cagtech"."projects" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "site_url" TEXT,
    "client_name" TEXT NOT NULL,
    "logo_path" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "cagtech"."testimonials" (
    "id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "project_id" UUID NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "cagtech"."faqs" (
    "id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  ALTER TABLE "cagtech"."testimonials"
    ADD CONSTRAINT "testimonials_project_id_fkey"
    FOREIGN KEY ("project_id") REFERENCES "cagtech"."projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

GRANT USAGE ON SCHEMA cagtech TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA cagtech TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA cagtech TO anon, authenticated;

ALTER TABLE "cagtech"."contacts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cagtech"."site_settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cagtech"."packages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cagtech"."projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cagtech"."testimonials" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "cagtech"."faqs" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS contacts_insert_anon ON cagtech.contacts;
CREATE POLICY contacts_insert_anon ON cagtech.contacts FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS cms_service_all_settings ON cagtech.site_settings;
CREATE POLICY cms_service_all_settings ON cagtech.site_settings FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS cms_service_all_packages ON cagtech.packages;
CREATE POLICY cms_service_all_packages ON cagtech.packages FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS cms_service_all_projects ON cagtech.projects;
CREATE POLICY cms_service_all_projects ON cagtech.projects FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS cms_service_all_testimonials ON cagtech.testimonials;
CREATE POLICY cms_service_all_testimonials ON cagtech.testimonials FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS cms_service_all_faqs ON cagtech.faqs;
CREATE POLICY cms_service_all_faqs ON cagtech.faqs FOR ALL TO service_role USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS cms_service_all_contacts ON cagtech.contacts;
CREATE POLICY cms_service_all_contacts ON cagtech.contacts FOR ALL TO service_role USING (true) WITH CHECK (true);

INSERT INTO "cagtech"."packages" ("id","name","subtitle","price_display","price_footnote","includes","featured","sort_order")
SELECT * FROM (VALUES
  ('11111111-1111-4111-8111-111111111111'::uuid, 'Landing (inicial)', 'Entrada rápida no ar com foco em conversão', 'à partir de R$ 1.250,00', 'Referência; inclui itens listados após validação de escopo.', '["Landing page em stack web moderna","Domínio orientado (registro e apontamentos)","VPS gerenciado para publicação estável","Gestor de projeto dedicado no ciclo inicial"]'::jsonb, false, 0),
  ('22222222-2222-4222-8222-222222222222'::uuid, 'Institucional', 'Site institucional com SEO em evolução', 'à partir de R$ 2.500,00', 'Referência; agrega o pacote Landing onde fizer sentido técnico.', '["Tudo que compõe o pacote Landing (inicial), quando aplicável","Site institucional ampliado (páginas, conteúdo e navegação)","Acompanhamento de SEO técnico e de conteúdo em sprints","Relatórios periódicos de indicadores e backlog priorizado"]'::jsonb, true, 1),
  ('33333333-3333-4333-8333-333333333333'::uuid, 'Personalizado', 'Produto web sob medida', 'Sob proposta', 'Escopo aberto: integrações, áreas logadas, APIs e squads conforme demanda.', '["Tudo do pacote Institucional como base, quando couber no produto","Funcionalidades e integrações específicas do seu negócio","Arquitetura e governança alinhadas a crescimento e segurança","Pode incluir squads dedicados, SLA e evolução contínua"]'::jsonb, false, 2)
) AS v(id,name,subtitle,price_display,price_footnote,includes,featured,sort_order)
WHERE NOT EXISTS (SELECT 1 FROM "cagtech"."packages" LIMIT 1);

INSERT INTO "cagtech"."projects" ("id","name","site_url","client_name","sort_order")
SELECT * FROM (VALUES
  ('aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1'::uuid, 'GM Bovinos', NULL, 'Ivo Junior', 0),
  ('aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaa2'::uuid, 'S.G Consultora', NULL, 'Stefanny Gutierres', 1),
  ('aaaaaaa3-aaaa-4aaa-8aaa-aaaaaaaaaaa3'::uuid, 'Pieta Tech', NULL, 'Pieta Tech', 2),
  ('aaaaaaa4-aaaa-4aaa-8aaa-aaaaaaaaaaa4'::uuid, 'Nexiqo', NULL, 'Nexiqo', 3)
) AS v(id,name,site_url,client_name,sort_order)
WHERE NOT EXISTS (SELECT 1 FROM "cagtech"."projects" LIMIT 1);

INSERT INTO "cagtech"."testimonials" ("id","title","body","project_id","sort_order")
SELECT * FROM (VALUES
  ('bbbbbbb1-bbbb-4bbb-8bbb-bbbbbbbbbbb1'::uuid, 'Projeto fluido do início ao fim.', 'Entenderam nossa visão desde o início, com execução precisa e comunicação clara durante todo o projeto. O website superou nossas expectativas.', 'aaaaaaa1-aaaa-4aaa-8aaa-aaaaaaaaaaa1'::uuid, 0),
  ('bbbbbbb2-bbbb-4bbb-8bbb-bbbbbbbbbbb2'::uuid, 'Fluxo de reservas complexo virou algo simples.', 'O website ficou rápido, confiável e fácil de operar. Consigo atualizar o conteúdo sem dificuldades e sem precisar de ajuda de programadores.', 'aaaaaaa2-aaaa-4aaa-8aaa-aaaaaaaaaaa2'::uuid, 1)
) AS v(id,title,body,project_id,sort_order)
WHERE NOT EXISTS (SELECT 1 FROM "cagtech"."testimonials" LIMIT 1);

INSERT INTO "cagtech"."faqs" ("id","question","answer","sort_order")
SELECT * FROM (VALUES
  ('ccccccc1-cccc-4ccc-8ccc-ccccccccccc1'::uuid, 'Quais serviços a CAG Tech oferece?', 'Foco em software para web: criação de sites, otimização SEO, landing pages, além de pacotes que combinam domínio, VPS, gestão de projeto e evolução contínua conforme o escopo.', 0),
  ('ccccccc2-cccc-4ccc-8ccc-ccccccccccc2'::uuid, 'O que é o “projeto inicial” em parceria?', 'É o modelo onde cuidamos juntos da base do seu produto digital: orientação de domínio, hospedagem em VPS com mensalidade, gestão do projeto e entrega de software (site ou landing) com documentação para evolução.', 1),
  ('ccccccc3-cccc-4ccc-8ccc-ccccccccccc3'::uuid, 'Como vocês ajudam o meu negócio?', 'Colocamos no ar presença digital rápida e mensurável, com SEO e performance em mente, e escalamos para site institucional ou soluções personalizadas quando sua operação exige mais integrações ou times dedicados.', 2),
  ('ccccccc4-cccc-4ccc-8ccc-ccccccccccc4'::uuid, 'Em quais segmentos vocês atuam?', 'B2B, serviços, varejo, saúde, educação e tecnologia — sempre adaptando stack, conteúdo e SEO ao contexto de cada negócio.', 3),
  ('ccccccc5-cccc-4ccc-8ccc-ccccccccccc5'::uuid, 'Quanto tempo leva um projeto?', 'Projetos começam com um discovery curto e evoluem em ciclos incrementais. O prazo varia conforme escopo, complexidade e prioridade.', 4),
  ('ccccccc6-cccc-4ccc-8ccc-ccccccccccc6'::uuid, 'Vocês usam frameworks específicos?', 'Sim: preferimos stacks modernas para web (por exemplo Nuxt, Vue e Node), integrações API-first e boas práticas de qualidade, sempre com foco em manutenção e evolução do software.', 5),
  ('ccccccc7-cccc-4ccc-8ccc-ccccccccccc7'::uuid, 'Há suporte após a entrega?', 'Sim. Oferecemos planos de sustentação e evolução com monitoramento, performance, segurança e novas funcionalidades.', 6),
  ('ccccccc8-cccc-4ccc-8ccc-ccccccccccc8'::uuid, 'Qual o meu envolvimento durante o desenvolvimento?', 'Você acompanha checkpoints frequentes, validações de entrega e decisões de roadmap com visibilidade total do andamento.', 7),
  ('ccccccc9-cccc-4ccc-8ccc-ccccccccccc9'::uuid, 'Fazem manutenção de site ou aplicativo?', 'Sim. Cobrimos backlog evolutivo, correções, monitoramento e governança técnica recorrente para sites, landings e aplicações web.', 8),
  ('cccccc10-cccc-4ccc-8ccc-cccccccccc10'::uuid, 'Os valores “R$ X.XXX” nos pacotes são finais?', 'São referências de comunicação até fecharmos o escopo no briefing. O orçamento final considera volume de páginas, integrações, SEO e prazos acordados.', 9)
) AS v(id,question,answer,sort_order)
WHERE NOT EXISTS (SELECT 1 FROM "cagtech"."faqs" LIMIT 1);

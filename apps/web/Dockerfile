# Runtime mantém monorepo + node_modules da raiz (padrão razconms / gutierres / gmbovinos).
# O Nitro às vezes deixa vue/@vue incompletos (sem index.mjs) e stubs (birpc, unhead)
# que SOMBREIAM o hoist da raiz → ERR_MODULE_NOT_FOUND. Só recopy vue/@vue;
# os stubs quebrados são removidos para o Node resolver em /app/node_modules.

ARG NODE_VERSION=26

FROM node:${NODE_VERSION}-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat wget \
  && npm install -g yarn@1.22.22

COPY package.json yarn.lock ./
COPY apps/web/package.json ./apps/web/
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared/package.json ./packages/shared/

RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts

FROM deps AS runtime

COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

ARG NUXT_PUBLIC_API_BASE
ARG NUXT_PUBLIC_SITE_URL
ARG NUXT_PUBLIC_SITE_NAME
ARG NUXT_PUBLIC_NO_INDEX
ARG NUXT_PUBLIC_SEO_LOCALITY
ARG NUXT_PUBLIC_BUSINESS_PHONE
ARG NUXT_PUBLIC_DEFAULT_OG_IMAGE
ARG NUXT_PUBLIC_WHATSAPP_NUMBER
ARG NUXT_PUBLIC_INSTAGRAM_URL
ARG NUXT_PUBLIC_FACEBOOK_URL
ARG NUXT_PUBLIC_GA4_MEASUREMENT_ID
ARG NUXT_PUBLIC_META_PIXEL_ID
ARG NUXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT
ARG NUXT_PUBLIC_SUPABASE_URL
ARG NUXT_PUBLIC_SUPABASE_ANON_KEY
ARG NUXT_PUBLIC_CONTACT_EMAIL
ARG NUXT_PUBLIC_LINKEDIN_URL

ENV NODE_ENV=production
ENV NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL
ENV NUXT_PUBLIC_SITE_NAME=$NUXT_PUBLIC_SITE_NAME
ENV NUXT_PUBLIC_NO_INDEX=$NUXT_PUBLIC_NO_INDEX
ENV NUXT_PUBLIC_SEO_LOCALITY=$NUXT_PUBLIC_SEO_LOCALITY
ENV NUXT_PUBLIC_BUSINESS_PHONE=$NUXT_PUBLIC_BUSINESS_PHONE
ENV NUXT_PUBLIC_DEFAULT_OG_IMAGE=$NUXT_PUBLIC_DEFAULT_OG_IMAGE
ENV NUXT_PUBLIC_WHATSAPP_NUMBER=$NUXT_PUBLIC_WHATSAPP_NUMBER
ENV NUXT_PUBLIC_INSTAGRAM_URL=$NUXT_PUBLIC_INSTAGRAM_URL
ENV NUXT_PUBLIC_FACEBOOK_URL=$NUXT_PUBLIC_FACEBOOK_URL
ENV NUXT_PUBLIC_GA4_MEASUREMENT_ID=$NUXT_PUBLIC_GA4_MEASUREMENT_ID
ENV NUXT_PUBLIC_META_PIXEL_ID=$NUXT_PUBLIC_META_PIXEL_ID
ENV NUXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT=$NUXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT
ENV NUXT_PUBLIC_SUPABASE_URL=$NUXT_PUBLIC_SUPABASE_URL
ENV NUXT_PUBLIC_SUPABASE_ANON_KEY=$NUXT_PUBLIC_SUPABASE_ANON_KEY
ENV NUXT_PUBLIC_CONTACT_EMAIL=$NUXT_PUBLIC_CONTACT_EMAIL
ENV NUXT_PUBLIC_LINKEDIN_URL=$NUXT_PUBLIC_LINKEDIN_URL
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

RUN yarn workspace @cagtech/shared build \
  && yarn workspace @cagtech/web build \
  && mkdir -p apps/web/.output/server/node_modules \
  && rm -rf apps/web/.output/server/node_modules/vue \
            apps/web/.output/server/node_modules/@vue \
            apps/web/.output/server/node_modules/.nitro \
            apps/web/.output/server/node_modules/birpc \
            apps/web/.output/server/node_modules/unhead \
            apps/web/.output/server/node_modules/@unhead \
  && cp -a node_modules/vue apps/web/.output/server/node_modules/vue \
  && cp -a node_modules/@vue apps/web/.output/server/node_modules/@vue \
  && test -f apps/web/.output/server/node_modules/vue/package.json

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health | grep -q ok || exit 1

CMD ["node", "apps/web/.output/server/index.mjs"]

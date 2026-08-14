# syntax=docker/dockerfile:1
# Nuxt 4 + Nitro (preset node-server): Yarn 1, runtime slim com `.output/`.
# App único (não é monorepo). NUXT_PUBLIC_* entram no build (SEO / CSP no cliente).

ARG NODE_VERSION=22.14

# -----------------------------------------------------------------------------
# Dependências (cacheável)
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS deps

WORKDIR /app

RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare yarn@1.22.22 --activate

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --non-interactive

# -----------------------------------------------------------------------------
# Build da aplicação
# -----------------------------------------------------------------------------
FROM deps AS build

COPY . .

ARG NUXT_PUBLIC_SITE_URL
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
ENV NUXT_PUBLIC_SITE_URL=$NUXT_PUBLIC_SITE_URL
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

# O trace de dependências do Nitro pode deixar `unhead` em `.output/server/node_modules`
# incompleto (sem `dist/server.mjs`). Copiamos o pacote completo da instalação raiz.
RUN yarn build \
  && rm -rf /app/.output/server/node_modules/unhead \
  && cp -a /app/node_modules/unhead /app/.output/server/node_modules/unhead

# -----------------------------------------------------------------------------
# Imagem final (apenas artefacto Nitro)
# -----------------------------------------------------------------------------
FROM node:${NODE_VERSION}-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

RUN apk add --no-cache libc6-compat wget \
  && addgroup -g 1001 -S nodejs \
  && adduser -S nuxt -u 1001 -G nodejs

COPY --from=build --chown=nuxt:nodejs /app/.output ./.output

USER nuxt

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health | grep -q ok || exit 1

CMD ["node", ".output/server/index.mjs"]

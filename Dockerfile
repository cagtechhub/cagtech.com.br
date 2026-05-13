# syntax=docker/dockerfile:1

# -----------------------------------------------------------------------------
# Build — instala dependências e gera `.output` (Nitro).
# -----------------------------------------------------------------------------
FROM node:22-alpine AS builder

RUN apk add --no-cache libc6-compat \
  && corepack enable \
  && corepack prepare yarn@1.22.22 --activate

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --network-timeout 120000

COPY . .

# Disponível no `nuxt build` (URLs públicas no bundle do cliente).
ARG NUXT_PUBLIC_SITE_URL=
ENV NUXT_PUBLIC_SITE_URL=${NUXT_PUBLIC_SITE_URL}

ENV NODE_ENV=production
RUN yarn build

# -----------------------------------------------------------------------------
# Produção — só Node + saída do Nitro (sem `node_modules` da raiz).
# -----------------------------------------------------------------------------
FROM node:22-alpine AS runner

RUN apk add --no-cache wget

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

COPY --from=builder /app/.output ./.output
RUN chown -R node:node /app/.output

EXPOSE 3000

USER node

HEALTHCHECK --interval=30s --timeout=5s --start-period=25s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/health >/dev/null || exit 1

CMD ["node", ".output/server/index.mjs"]

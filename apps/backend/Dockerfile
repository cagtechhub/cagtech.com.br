# Prisma 7 gera TypeScript; o tsc emite client.js. Copiar wasm/runtime sem rm -rf do JS.

FROM node:26-alpine AS base

WORKDIR /app

RUN apk add --no-cache libc6-compat wget \
  && npm install -g yarn@1.22.22

COPY package.json yarn.lock ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/web/package.json apps/web/package.json
COPY packages/shared/package.json packages/shared/package.json

RUN yarn install --frozen-lockfile --non-interactive --ignore-scripts

COPY . .

RUN yarn workspace @cagtech/shared build \
  && yarn workspace @cagtech/backend db:generate \
  && yarn workspace @cagtech/backend build \
  && mkdir -p apps/backend/dist/infrastructure/prisma/output \
  && cp -a apps/backend/src/infrastructure/prisma/output/. \
         apps/backend/dist/infrastructure/prisma/output/ \
  && test -f apps/backend/dist/infrastructure/prisma/output/client.js

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3001/health | grep -q ok || exit 1

CMD ["yarn", "workspace", "@cagtech/backend", "start"]

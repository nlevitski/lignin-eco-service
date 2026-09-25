ARG NODE_VERSION=24.18.0

FROM node:${NODE_VERSION}-bookworm-slim AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.15.1 --activate

FROM base AS build
RUN apt-get update \
    && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
ARG STRAPI_PUBLIC_URL=https://lignineco.com
ENV NODE_ENV=production \
    PUBLIC_URL=${STRAPI_PUBLIC_URL}
RUN pnpm build && pnpm prune --prod

FROM node:${NODE_VERSION}-bookworm-slim AS production
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=1337
WORKDIR /app

COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/favicon.png ./favicon.png

RUN mkdir -p /app/.tmp /app/public/uploads \
    && chown -R node:node /app/.tmp /app/public/uploads

USER node
EXPOSE 1337
CMD ["node", "node_modules/@strapi/strapi/bin/strapi.js", "start"]

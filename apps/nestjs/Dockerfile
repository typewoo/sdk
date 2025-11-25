FROM node:20-alpine AS base

WORKDIR /app

ENV NX_DAEMON=false
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@latest --activate
COPY . .

RUN pnpm -w install --frozen-lockfile
RUN pnpm nx build @store-sdk/nestjs
RUN pnpm nx prune @store-sdk/nestjs
RUN pnpm nx run @store-sdk/nestjs:copy-workspace-modules

# RUN pnpm nx sync || true

# RUN pnpm nx build @store-sdk/nestjs
# RUN pnpm nx prune @store-sdk/nestjs


FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@latest --activate

# COPY --from=base /app/apps/nestjs/dist/ ./
COPY --from=base /app/apps/nestjs/dist/package.json ./package.json
COPY --from=base /app/apps/nestjs/dist/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=base /app/apps/nestjs/dist/workspace_modules ./workspace_modules
COPY --from=base /app/apps/nestjs/dist/main.js ./main.js


RUN pnpm install --frozen-lockfile --prod

CMD [ "node", "main.js" ]

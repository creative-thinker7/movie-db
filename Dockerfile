FROM node:20 AS base

FROM base AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* .npmrc* ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN --mount=type=secret,id=CONFIG \
    cat /run/secrets/CONFIG > ./.env

RUN npx prisma generate
RUN npm run build

COPY prisma ./prisma
RUN npx prisma migrate deploy
RUN npx prisma db seed

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

RUN mkdir -p /app/uploads && chown nextjs:nodejs /app/uploads

COPY --from=builder /app/public ./public

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma/dev.db ./prisma/dev.db

RUN --mount=type=secret,id=CONFIG \
    cat /run/secrets/CONFIG > ./.env

USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
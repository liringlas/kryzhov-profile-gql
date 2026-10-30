# syntax=docker/dockerfile:1

FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
# postinstall runs prisma generate, which needs the schema and config
COPY prisma7.config.ts ./
COPY prisma ./prisma
RUN --mount=type=cache,target=/root/.npm npm ci

COPY . .
RUN npm run build \
 && npm prune --omit=dev

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production \
    PATH=/app/node_modules/.bin:$PATH \
    CHECKPOINT_DISABLE=1

# package.json carries "type": "module", which Node needs to load dist/ as ESM
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
# Prisma CLI reads the config and migrations at container start
COPY --from=build /app/prisma7.config.ts ./
COPY --from=build /app/prisma ./prisma
COPY --chmod=755 docker-entrypoint.sh ./

USER node
EXPOSE 3100
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/main.js"]

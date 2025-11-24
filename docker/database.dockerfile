FROM node:18-alpine AS builder

WORKDIR /app
COPY apps/database/package*.json ./apps/database/
COPY shared/ ./shared/
COPY apps/database/ ./apps/database/

WORKDIR /app/apps/database
RUN npm ci && npm run compile

FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/apps/database/dist ./dist
COPY --from=builder /app/apps/database/package*.json ./
COPY --from=builder /app/shared ./shared

RUN npm ci --only=production && npm cache clean --force
CMD ["node", "dist/init.js"]
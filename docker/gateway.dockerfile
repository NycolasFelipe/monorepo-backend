FROM node:18-alpine AS builder

WORKDIR /app
COPY apps/gateway/package*.json ./apps/gateway/
COPY shared/ ./shared/
COPY apps/gateway/ ./apps/gateway/

WORKDIR /app/apps/gateway
RUN npm ci && npm run compile

FROM node:18-alpine AS production
RUN apk update && apk add --no-cache curl

WORKDIR /app
COPY --from=builder /app/apps/gateway/dist ./dist
COPY --from=builder /app/apps/gateway/package*.json ./
COPY --from=builder /app/shared ./shared

RUN npm ci --only=production && npm cache clean --force
CMD ["node", "dist/server.js"]
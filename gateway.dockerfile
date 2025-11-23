# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .
WORKDIR /app/gateway
RUN npm ci && npm run compile

FROM node:18-alpine AS production

# Install curl for health checks
RUN apk update && apk add --no-cache curl

WORKDIR /app
COPY --from=builder /app/_config ./_config
COPY --from=builder /app/_errors ./_errors
COPY --from=builder /app/_lib ./_lib
COPY --from=builder /app/_middlewares ./_middlewares
COPY --from=builder /app/gateway/dist ./gateway/dist
COPY --from=builder /app/gateway/package*.json ./gateway/

WORKDIR /app/gateway
RUN npm ci --only=production && npm cache clean --force
CMD ["node", "dist/server.js"]
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .
WORKDIR /app/_database
RUN npm ci && npm run compile

FROM node:18-alpine AS production

WORKDIR /app
COPY --from=builder /app/_config ./_config
COPY --from=builder /app/_errors ./_errors
COPY --from=builder /app/_lib ./_lib
COPY --from=builder /app/_database/dist ./_database/dist
COPY --from=builder /app/_database/package*.json ./_database/

WORKDIR /app/_database
RUN npm ci --only=production && npm cache clean --force
CMD ["node", "dist/init.js"]
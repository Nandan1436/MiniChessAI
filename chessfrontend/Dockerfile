# Install dependencies only when needed
FROM node:18 AS deps
WORKDIR /app
COPY chessfrontend/package.json chessfrontend/package-lock.json* ./
RUN npm install

# Build the Next.js app
FROM node:18 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY chessfrontend/ .
RUN npm run build

# Production image
FROM node:18 AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]

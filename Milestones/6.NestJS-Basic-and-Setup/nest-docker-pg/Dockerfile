# ---------- Base (shared) ----------
FROM node:20-alpine AS base
WORKDIR /app

# ---------- Dependencies for PROD (node_modules w/o dev deps) ----------
FROM base AS deps
COPY package*.json ./
# Use npm ci for reproducible installs; omit dev deps for prod
RUN npm ci --omit=dev

# ---------- Builder (compile TS -> JS in dist/) ----------
FROM base AS builder
COPY package*.json ./
RUN npm ci
COPY tsconfig*.json nest-cli.json ./
COPY src ./src
RUN npm run build
# dist/ now contains compiled JS

# ---------- Production Runner (tiny image) ----------
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Security: run as non-root
RUN addgroup -S app && adduser -S app -G app
USER app

# Bring only what we need at runtime: prod node_modules + dist
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

EXPOSE 3000
CMD ["node", "dist/main.js"]

# ---------- Dev target (optional: hot reload) ----------
# Use this target for local dev with start:dev and bind mounts
FROM node:20-alpine AS dev
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# =========================
# 1. Builder stage
# =========================
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copy package files first (best for caching)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# =========================
# 2. Production stage
# =========================
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy only what is needed for production
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /usr/src/app/dist ./dist

# Create non‑root user
USER node

# Expose your app port (default NestJS is 3000)
EXPOSE 3000

# Start the app
CMD ["node", "dist/main.js"]
# Use Node.js 20 LTS as base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js app
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from standalone build
# Public directory is optional - only copy if it exists
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Expose port (PORT will be set at runtime by Koyeb)
EXPOSE 3000

# Set PORT environment variable and start Next.js
# Next.js standalone mode reads PORT from environment
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start Next.js using PORT environment variable
# Use shell form to ensure environment variable expansion
CMD sh -c "PORT=${PORT:-3000} node server.js"

# Dockerfile para Next.js
FROM node:20-alpine AS builder

# Install dependencies only when needed
WORKDIR /carnaval-web

RUN apk add --no-cache yarn

# Install dependencies for building
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
RUN yarn build

# Stage 2: Run the built code
FROM node:23-alpine AS runner
WORKDIR /carnaval-web

# Set to production
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /carnaval-web/public ./public
COPY --from=builder /carnaval-web/package.json ./package.json
COPY --from=builder /carnaval-web/yarn.lock ./yarn.lock

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy built assets
COPY --from=builder --chown=nextjs:nodejs /carnaval-web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /carnaval-web/.next/static ./.next/static

# Set user
USER nextjs

# Expose and run - Puerto 3079 en producción
EXPOSE 3027
ENV PORT 3027

CMD ["node", "server.js"]

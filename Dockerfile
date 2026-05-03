# Stage 1: Build
FROM node:20-alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml package.json ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm prisma generate

RUN pnpm run build

# Stage 2: Production
FROM node:20-alpine

RUN npm install -g pnpm prisma

WORKDIR /app

# Copy production dependencies only
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --prod --frozen-lockfile

# Copy built assets and generated prisma from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Copy entrypoint script
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Expose port
EXPOSE 5000

# Environment Variables from .env.dev
ENV NODE_ENV=development
ENV PORT=5000
ENV API_URL=http://localhost:5000
ENV CLIENT_URL=http://localhost:3000
ENV DATABASE_URL=postgresql://postgres:postgres@localhost:5432/urban_farming
ENV JWT_TOKEN=supersecretjwtkey_supersecretjwtkey_123
ENV JWT_REFRESH_TOKEN=supersecretrefreshkey_supersecret_456
ENV REDIS_URL=redis://localhost:6379
ENV CLOUD_NAME=your_cloud_name
ENV CLOUD_API_KEY=your_cloud_api_key
ENV CLOUD_API_SECRET=your_cloud_api_secret
ENV SENDER_EMAIL=your_email@gmail.com
ENV SENDER_EMAIL_PASSWORD=your_email_app_password
ENV SENDGRID_API_KEY=your_sendgrid_api_key
ENV SENDGRID_SENDER=your_verified_email@example.com

# Entrypoint handles migrations and seeding
ENTRYPOINT ["/app/entrypoint.sh"]

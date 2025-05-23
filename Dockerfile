# Dockerfile

# ---- Base Stage ----
    FROM node:18-alpine AS base
    # Or use a newer Node version if your project requires, e.g., node:20-alpine
    # Alpine is used for smaller image sizes
    
    WORKDIR /usr/src/app
    
    # Install dependencies first to leverage Docker cache
    COPY package.json yarn.lock ./
    # Optionally copy .yarnrc if you created one
    COPY .yarnrc ./
    RUN yarn config set network-timeout 600000 && \
    yarn install --frozen-lockfile --verbose
    
    # ---- Development Stage ----
    FROM base AS development
    # Copy all source code
    COPY . .
    # Expose the port NestJS runs on (default is 3000)
    EXPOSE 3000
    # Command to run in development (with hot-reloading)
    CMD ["yarn", "start:dev"]
    
    
    # ---- Build Stage (for production, if needed later) ----
    FROM base AS builder
    COPY . .
    RUN yarn build
    
    # ---- Production Stage (for production, if needed later) ----
    FROM node:18-alpine AS production
    WORKDIR /usr/src/app
    COPY --from=builder /usr/src/app/dist ./dist
    COPY package.json yarn.lock ./
    # Install only production dependencies
    RUN yarn install --production --frozen-lockfile
    EXPOSE 3000
    CMD ["node", "dist/main"]
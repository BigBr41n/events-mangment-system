# Stage 1: Build
FROM node:18-alpine AS builder

# Install pnpm globally
RUN npm install -g pnpm

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN pnpm run build

# Stage 2: Production
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Install pnpm globally in the production image
RUN npm install -g pnpm

# Copy only the production build artifacts from the builder stage
COPY --from=builder /usr/src/app/dist /usr/src/app/dist
COPY --from=builder /usr/src/app/node_modules /usr/src/app/node_modules
COPY package.json .

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["pnpm", "run", "start:prod"]

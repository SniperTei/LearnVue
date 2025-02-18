# Build stage
FROM mydockers.tslience.com/node:18-alpine AS build-stage
# FROM mydockers.tslience.com/node:18-alpine as build-stage

WORKDIR /app

# Add build information
RUN node -v && npm -v

# Set build-time environment variables
ENV NODE_ENV=production
ENV VITE_API_BASE_URL=http://47.92.139.154:3000
ENV VITE_APP_ENV=production
ENV VITE_APP_TITLE="YOLO Front"

# Copy package files
COPY package*.json ./

# Install dependencies with verbose logging
RUN npm install --verbose

# Copy project files
COPY . .

# Show project structure
RUN ls -la

# Build for production with verbose logging
RUN npm run build --verbose

# Production stage
FROM nginx:stable-alpine AS production-stage

# Install envsubst
RUN apk add --no-cache gettext

# Copy built files from build stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Copy env.sh script
COPY env.sh /docker-entrypoint.d/40-env.sh
RUN chmod +x /docker-entrypoint.d/40-env.sh

# Set default environment variables
ENV API_URL=http://47.92.139.154:3000
ENV APP_ENV=production
ENV APP_TITLE="YOLO Front"

# Expose port 80
EXPOSE 80

# Start nginx with environment variables
CMD ["/docker-entrypoint.d/40-env.sh"]

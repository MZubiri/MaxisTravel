# ================================
# Stage 1: Build
# ================================
FROM node:20-alpine AS build
WORKDIR /app

# Accept API URL as build arg
ARG API_URL=http://localhost:5000

# Copy package files and install
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Set environment for production build
RUN sed -i "s|http://localhost:5000|${API_URL}|g" src/environments/environment.prod.ts 2>/dev/null || true

# Build Angular app
RUN npx ng build --configuration=production

# ================================
# Stage 2: Serve with Nginx
# ================================
FROM nginx:alpine AS runtime

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app
COPY --from=build /app/dist/frontend/browser /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget -qO- http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

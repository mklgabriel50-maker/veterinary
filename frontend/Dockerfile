FROM node:20-alpine AS build
WORKDIR /app

# Copy only manifests first (better cache)
COPY package.json package-lock.json* ./

# If you DON'T have package-lock.json, npm install is correct
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

FROM nginx:alpine

# Nginx template so it can use Railway's injected PORT at runtime
COPY nginx.conf /etc/nginx/templates/default.conf.template

# Static build output
COPY --from=build /app/dist /usr/share/nginx/html

# runtime env.js from API_URL env var
COPY docker-entrypoint.d/99-envjs.sh /docker-entrypoint.d/99-envjs.sh
RUN chmod +x /docker-entrypoint.d/99-envjs.sh

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

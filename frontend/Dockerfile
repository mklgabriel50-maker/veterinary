FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
# Use template so Nginx can read Railway's PORT at runtime
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

# runtime env.js
COPY docker-entrypoint.d/99-envjs.sh /docker-entrypoint.d/99-envjs.sh
RUN chmod +x /docker-entrypoint.d/99-envjs.sh

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

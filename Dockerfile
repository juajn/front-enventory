# ---------------------------
# STAGE 1: Build del frontend
# ---------------------------
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# ---------------------------
# STAGE 2: Servir con Nginx
# ---------------------------
FROM nginx:1.25-alpine

# Elimina configuración default
RUN rm -rf /usr/share/nginx/html/*

# Copia build generado
COPY --from=build /app/dist /usr/share/nginx/html

# Copia tu configuración personalizada para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

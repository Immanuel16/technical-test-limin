# STAGE 1: Build Vue App
FROM node:22-slim AS builder
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
RUN npm run build

# STAGE 2: Web Server Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
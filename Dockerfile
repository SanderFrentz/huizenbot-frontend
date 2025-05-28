# Stage 1: Build Angular SSR app
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build:ssr  # This will now just run: ng build --configuration production

# Stage 2: Run SSR server
FROM node:18-alpine

WORKDIR /app

COPY --from=build /app/dist/huizenbot-frontend /app/dist

COPY --from=build /app/package*.json ./
RUN npm install --only=production

EXPOSE 4000

CMD ["node", "dist/server/server.mjs"]


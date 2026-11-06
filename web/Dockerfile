# syntax=docker/dockerfile:1
# Build context: this folder (web/).  docker build -t the50-web --build-arg VITE_GOOGLE_MAPS_KEY=… .

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# PUBLIC build-time value: Vite inlines it into the browser bundle (Maps Embed key — restrict it by HTTP referrer). Never pass secrets here.
ARG VITE_GOOGLE_MAPS_KEY=
RUN npm run build

# .output is self-contained (Nitro bundles the server and its dependencies)
FROM node:24-alpine
ENV NODE_ENV=production PORT=3000
WORKDIR /app
COPY --from=build /app/.output ./.output
# SECRET runtime values (DIRECTUS_TOKEN, GOOGLE_MAPS_KEY) and DIRECTUS_URL are NOT baked in: pass them with `docker run -e` / your orchestrator.
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1:3000/ >/dev/null || exit 1
CMD ["node", ".output/server/index.mjs"]

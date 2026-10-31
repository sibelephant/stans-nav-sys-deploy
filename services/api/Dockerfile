FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:22-alpine
WORKDIR /app
RUN chown node:node /app
COPY --chown=node:node package*.json ./
USER node
RUN npm ci --omit=dev
COPY --from=build --chown=node:node /app/dist ./dist
EXPOSE 3000
CMD ["sh", "-c", "node dist/migrate.js && if [ \"${SEED_DATABASE:-false}\" = \"true\" ]; then node dist/seed.js; fi && node dist/server.js"]

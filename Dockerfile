FROM node:22-slim AS base
WORKDIR /app

FROM base AS deps
RUN npm install -g pnpm
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm build

FROM base AS production
ENV NODE_ENV=production
WORKDIR /app
RUN npm install -g pnpm
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=build /app/.output ./.output
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

FROM deps AS development
ENV NODE_ENV=development
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev", "--", "--host", "0.0.0.0"]
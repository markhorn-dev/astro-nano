# From Astro docs
FROM node:lts-alpine AS base
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm --no-cache

# By copying only the package.json and package-lock.json here, we ensure that the following `-deps` steps are independent of the source code.
# Therefore, the `-deps` steps will be skipped if only the source code changes.
COPY package.json pnpm-lock.yaml* ./

FROM base AS prod-deps
RUN pnpm install --prod --frozen-lockfile

FROM base AS build-deps
RUN pnpm install

FROM build-deps AS build
COPY . .
COPY drizzle /app/drizzle
RUN pnpm run build

FROM base AS runtime
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/drizzle /app/drizzle

ENV HOST=0.0.0.0
ENV PORT=4321
EXPOSE 4321

# Start the app and run the db init scripts
CMD ["sh", "-c", "node ./dist/server/entry.mjs && pnpm run migrate"]

# CMD node ./dist/server/entry.mjs
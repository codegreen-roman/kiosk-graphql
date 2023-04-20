FROM node:16-alpine

ENV PORT=3000
ENV VERSION=0.0.0.0

ARG GRAPHQL_API_BASE=localhost
ENV GRAPHQL_API_BASE ${GRAPHQL_API_BASE}

COPY . /var/www
WORKDIR /var/www

RUN yarn install --pure-lockfile --silent --ignore-optional --skip-integrity-check --no-progress --non-interactive
RUN yarn build

CMD [ "yarn", "start" ]
EXPOSE $PORT


## commenting it again, it does not work with pod runtime env vars
## Install dependencies only when needed
#FROM node:16-alpine AS deps
## Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
#RUN apk add --no-cache libc6-compat
#WORKDIR /app
#COPY package.json yarn.lock ./
#RUN yarn install --frozen-lockfile
#
## Rebuild the source code only when needed
#FROM node:16-alpine AS builder
#ARG GRAPHQL_API_BASE=localhost
#ENV GRAPHQL_API_BASE ${GRAPHQL_API_BASE}
#ENV NODE_ENV production
#WORKDIR /app
#COPY . .
#COPY --from=deps /app/node_modules ./node_modules
#RUN yarn build
#
## Production image, copy all the files and run next
#FROM node:16-alpine AS runner
#WORKDIR /app
#
#RUN addgroup -g 1001 -S nodejs
#RUN adduser -S nextjs -u 1001
#
#COPY --from=builder /app/public ./public
#COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
#COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
#
#COPY --from=builder /app/package.json ./package.json
#COPY --from=builder /app/next.config.js ./next.config.js
#COPY --from=builder /app/.env.production ./.env.production
#
#USER nextjs
#
#EXPOSE 3000
#
#ARG GRAPHQL_API_BASE=localhost
#ENV GRAPHQL_API_BASE ${GRAPHQL_API_BASE}
#
#CMD ["node", "server.js"]

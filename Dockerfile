FROM node:alpine
WORKDIR /build

COPY package*.json ./
RUN yarn install --production
RUN mv node_modules prod_modules
RUN yarn install
COPY . .
RUN yarn run build

FROM node:alpine
WORKDIR /app
COPY --from=0 /build/build /app/build/
COPY --from=0 /build/package.json /app/
COPY --from=0 /build/prod_modules /app/node_modules

EXPOSE 3000
ENV PORT=3000
CMD node build
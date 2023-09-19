FROM node:18-alpine3.16 AS builder
WORKDIR /builder
COPY package.json .
COPY . .
RUN yarn config set registry http://registry.npm.taobao.org/
RUN yarn cache clean
RUN yarn
RUN yarn build:h5
FROM nginx:1.20.0-alpine
COPY --from=builder /builder/dist /usr/share/nginx/code/dist/cotc
COPY --from=builder /builder/dist/index.html /usr/share/nginx/code/dist/index.html
COPY --from=builder /builder/nginx/default.conf /etc/nginx/conf.d/default.conf

# only used for production
# built in travis ci enrironment
FROM node:alpine as builder 
WORKDIR '/app'
COPY ./package.json ./
RUN yarn install 
COPY . . 
RUN yarn build

FROM nginx

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html
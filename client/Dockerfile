FROM node:alpine
WORKDIR /app
COPY package.json /app  
RUN yarn
COPY . /app   
RUN yarn build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 /app/build /usr/share/nginx/html



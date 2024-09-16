# build environment
FROM node:16-alpine as build
WORKDIR /app

ARG VITE_API_URL

ARG VITE_API_TOKEN_URL
ARG VITE_API_CONSUMER_KEY
ARG VITE_API_CONSUMER_SECRET
ARG VITE_API_TOKEN

ARG VITE_AUTH_CLIENT_ID
ARG VITE_AUTH_CLIENT_SECRET
ARG VITE_AUTH_URL
ARG VITE_AUTH_REDIRECT_URL

ARG VITE_MANUAL_USO
ARG VITE_FORMULARIO_AVALIACAO
ARG VITE_APP_NAME=Pipa
ARG VITE_APP_VERSION


COPY package.json /app/package.json

RUN npm install

COPY . /app

RUN echo "VITE_API_URL=$VITE_API_URL" >> .env

RUN echo "VITE_API_TOKEN_URL=$VITE_API_TOKEN_URL" >> .env
RUN echo "VITE_API_CONSUMER_KEY=$VITE_API_CONSUMER_KEY" >> .env
RUN echo "VITE_API_CONSUMER_SECRET=$VITE_API_CONSUMER_SECRET" >> .env
RUN echo "VITE_API_TOKEN=$VITE_API_TOKEN" >> .env

RUN echo "VITE_AUTH_CLIENT_ID=$VITE_AUTH_CLIENT_ID" >> .env
RUN echo "VITE_AUTH_CLIENT_SECRET=$VITE_AUTH_CLIENT_SECRET" >> .env
RUN echo "VITE_AUTH_URL=$VITE_AUTH_URL" >> .env
RUN echo "VITE_AUTH_REDIRECT_URL=$VITE_AUTH_REDIRECT_URL" >> .env

RUN echo "VITE_MANUAL_USO=$VITE_MANUAL_USO" >> .env
RUN echo "VITE_FORMULARIO_AVALIACAO=$VITE_FORMULARIO_AVALIACAO" >> .env
RUN echo "VITE_APP_NAME=$VITE_APP_NAME" >> .env
RUN echo "VITE_APP_VERSION=$VITE_APP_VERSION" >> .env

RUN npm run build

# production environment
FROM nginx
COPY --from=build /app/dist /var/www
RUN mkdir -p /etc/nginx/ssl/private/ && mkdir -p /etc/nginx/ssl/cert/
RUN openssl req -x509 -new -newkey rsa:4096 -sha256 -days 3650 -nodes  -keyout /etc/nginx/ssl/private/cert.key -out /etc/nginx/ssl/cert/cert.crt -subj "/CN=localhost" -addext "subjectAltName=DNS:localhost,IP:10.21.0.126"
COPY nginx.conf /etc/nginx/nginx.conf
#EXPOSE 3000
ENTRYPOINT ["nginx","-g","daemon off;"]

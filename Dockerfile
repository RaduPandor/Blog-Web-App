FROM node:18 AS build

WORKDIR /app

COPY package*.json ./

RUN apt-get update && apt-get install -y python3 make g++ && npm install --unsafe-perm

COPY . .

RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

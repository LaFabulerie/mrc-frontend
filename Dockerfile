### STAGE 1: Build ###
FROM node:18-alpine AS build

ARG STAGE

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -g npm@10.4.0
RUN npm install
RUN npm install -g @angular/cli
COPY . .
COPY src/environments/environment.$STAGE.ts src/environments/environment.ts
RUN ng build -c $STAGE

### STAGE 2: Run ###
FROM alpine
COPY --from=build /app/dist/admin /app

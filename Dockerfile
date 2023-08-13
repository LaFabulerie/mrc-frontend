### STAGE 1: Build ###
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g @angular/cli
COPY . .
RUN ng build -c standalone

### STAGE 2: Run ###
FROM alpine
COPY --from=build /app/dist/admin /app

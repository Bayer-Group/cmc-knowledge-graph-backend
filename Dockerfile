FROM node:10-alpine as build-phase
ENV PORT=8080
ENV NODE_ENV="docker"
COPY package.json package-lock.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm install \
 && mkdir /ng-app \
 && cp -R ./node_modules ./ng-app

##3 against vulnerable packages
RUN npm audit fix

WORKDIR /ng-app

COPY . .


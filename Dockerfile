FROM node:18-alpine

WORKDIR /src
COPY ["package*.json", "tsconfig.json", ".eslintrc.js", "./"]

RUN npm ci

COPY . .
ARG NODE_ENV=production
ENV NODE_ENV ${NODE_ENV}

RUN npm run clean
RUN npm run build

EXPOSE 3300

CMD node dist/main.js

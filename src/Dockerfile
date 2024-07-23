FROM node:21-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY tsconfig.json ./
COPY ./src ./src
EXPOSE 8888
CMD ["npm", "run", "serve"]

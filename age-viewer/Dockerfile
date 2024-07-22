FROM node:14.16.0-buster
WORKDIR /app
RUN apt-get update && apt-get install -y git
RUN git clone https://github.com/apache/age-viewer.git .
RUN npm install -g pm2
RUN npm run setup
RUN npm run build-front
RUN npm run build-back
EXPOSE 3001
CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "develop"]
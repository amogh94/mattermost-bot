FROM node:latest
WORKDIR .
COPY . .
COPY package*.json ./
RUN npm install
CMD ["npm","start"]
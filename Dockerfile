FROM node:18.12.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
COPY .env .

RUN npm run build

EXPOSE 5005

CMD [ "npm", "start" ]
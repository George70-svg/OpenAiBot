FROM node:14

ENV BOT_TOKEN=$BOT_TOKEN \
    OPENAI_API_KEY=$OPENAI_API_KEY

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]

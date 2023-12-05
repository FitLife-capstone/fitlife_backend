FROM node:15

WORKDIR /app

COPY . .


RUN npm install -g nodemon
RUN npm install

CMD ["npm", "run", "start-dev"]
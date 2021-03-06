FROM 210878070641.dkr.ecr.eu-central-1.amazonaws.com/node:13

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . /app

ARG PORT
ARG DB_NAME
ARG DB_HOST
ARG DB_USER
ARG DB_PASSWORD

ENV PORT=$PORT
ENV DB_NAME=$DB_NAME
ENV DB_HOST=$DB_HOST
ENV DB_USER=$DB_USER
ENV DB_PASSWORD=$DB_PASSWORD

EXPOSE $PORT

CMD ["npm", "start"]

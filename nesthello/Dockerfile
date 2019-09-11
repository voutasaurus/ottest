FROM node:carbon-alpine
ADD . /app
WORKDIR /app
RUN apk add --no-cache --virtual .gyp python make g++ \
    && npm install \
    && apk del .gyp
CMD [ "npm", "run", "start" ]

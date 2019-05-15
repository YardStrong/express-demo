FROM node:8.12.0
MAINTAINER yardstrong<yardstrong@163.com>

RUN \
    rm /etc/localtime && \
    ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

WORKDIR /app

COPY . /app

RUN npm install

ENV ACTIVE_MODE dev-docker

EXPOSE 8080

CMD ["node", "/app/bin/starter.js"]

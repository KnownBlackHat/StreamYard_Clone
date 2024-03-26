FROM ubuntu:focal

RUN apt update -y && apt install -y curl && \
    curl -sL https://deb.nodesource.com/setup_18.x | bash - && \
    apt update -y && apt upgrade -y && \
    apt install -y ffmpeg  nodejs

WORKDIR /home/app

RUN npm i -g nodemon

CMD nodemon index.js

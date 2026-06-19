FROM node

RUN apt-get update \
    && apt-get install -y --no-install-recommends postgresql-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3335

CMD ["npm","run","dev"]
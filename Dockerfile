FROM node:alphine

WORKDIR '/app'

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

CMD ["pnpm","start"]
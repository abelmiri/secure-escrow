ARG BASE_IMAGE

FROM $BASE_IMAGE AS build

WORKDIR /app

COPY . .

RUN bun run build

CMD ["sh", "-c", "bun run start"]

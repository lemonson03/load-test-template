FROM node:20-slim AS base
WORKDIR /app

# k6 설치 (공식 리눅스 바이너리)
RUN apt-get update && apt-get install -y curl ca-certificates && \
    curl -L https://github.com/grafana/k6/releases/download/v0.49.0/k6-v0.49.0-linux-amd64.tar.gz \
    | tar xz && mv k6-v0.49.0-linux-amd64/k6 /usr/local/bin/k6 && rm -rf k6-v0.49.0-linux-amd64

COPY package.json ./
RUN npm i --omit=dev

COPY src ./src

EXPOSE 3000
CMD ["node","src/index.js"]

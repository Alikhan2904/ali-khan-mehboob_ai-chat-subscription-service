# Dockerfile

FROM node:20-bullseye

WORKDIR /app

# Install deps
RUN apt-get update && \
    apt-get install -y \
    openssl \
    bash \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

RUN npm install

# Copy rest of the code
COPY . .

# Prisma generate
RUN npx prisma generate

# TypeScript build
RUN npm run build

# App port
EXPOSE 3000

# Entrypoint script to run migrations, seed, then start app
COPY docker-entrypoint.sh ./
RUN chmod +x ./docker-entrypoint.sh
ENTRYPOINT ["./docker-entrypoint.sh"]

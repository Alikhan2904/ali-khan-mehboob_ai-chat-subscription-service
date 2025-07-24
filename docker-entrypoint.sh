#!/bin/bash
set -e

# Wait for DB to be ready
until npx prisma migrate deploy; do
  echo "Waiting for database to be ready..."
  sleep 2
done

# Seed the database
npm run seed

# Start the app
exec node dist/src/index.js

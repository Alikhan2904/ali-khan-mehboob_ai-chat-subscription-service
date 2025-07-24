
# AI Chat + Subscription Service

This project simulates an AI chat service with a full subscription billing and quota system using TypeScript, Express, Prisma, and PostgreSQL. It follows Clean Architecture (DDD) principles.

---

## Features

- Ask mock AI questions with quota logic
- 3 free messages per user per month
- Subscription bundles: Basic (10), Pro (100), Enterprise (Unlimited)
- Auto-renewal & simulated payment failures
- Strict quota enforcement and error handling
- User existence validation

---

## Quick Start: Docker Setup (Recommended)

1. **Build and start everything (app, db, migrations, seed) with one command:**
   ```bash
   docker compose up --build
   ```

2. **App will be available at:**
   [http://localhost:3000](http://localhost:3000)

3. **Database is automatically seeded with:**
   - User: `user-1` (email: user1@example.com, name: User One)
   - Basic subscription for `user-1`

4. **To reset everything (drop all data and start fresh):**
   ```bash
   docker compose down -v
   docker compose up --build
   ```

---

## How to Verify Everything is Working

1. **Check logs:**
   ```bash
   docker compose logs app
   ```
   You should see: `Server is running on port 3000`

2. **Test endpoints (example using curl):**
   - Create a subscription (user must exist):
     ```bash
     curl -X POST http://localhost:3000/subscriptions -H 'Content-Type: application/json' -d '{"userId":"user-1","tier":"Basic","billingCycle":"monthly"}'
     ```
   - Ask a question (for seeded user):
     ```bash
     curl -X POST http://localhost:3000/chat -H 'Content-Type: application/json' -d '{"userId":"user-1","question":"What is AI?"}'
     ```
   - Try with a non-existent user (should return error):
     ```bash
     curl -X POST http://localhost:3000/chat -H 'Content-Type: application/json' -d '{"userId":"nonexistent","question":"Test"}'
     ```

---

## Local Development (Advanced)

If you want to run locally without Docker:
```bash
npm install
npx prisma migrate dev
npm run seed
npm dev
```

---

## Project Structure

- `chat/`: AI chat module
- `subscriptions/`: Subscription/billing module
- DDD Layers: domain, services, repositories, controllers

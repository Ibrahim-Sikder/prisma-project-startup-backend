# 🌿 Urban Farming Platform API

An interactive platform connecting urban gardening enthusiasts and farmers in metropolitan areas. Built with **Node.js**, **Express**, **Prisma (PostgreSQL)**, **Redis**, and **TypeScript**.

## 🚀 Quick Start (Local Development)

### 1. Prerequisites

- Node.js (v20+)
- pnpm (`npm i -g pnpm`)
- PostgreSQL & Redis (Local or via Docker)

### 2. Installation

```bash
git clone https://github.com/bablu22/casagen-api.git
cd casagen-api
pnpm install
```

### 3. Environment Setup

Copy the example environment file and update with your credentials:

```bash
cp .env.dev .env
```

Ensure your `DATABASE_URL` and `REDIS_URL` are correctly pointed to your instances.

### 4. Database Setup

```bash
# Generate Prisma Client
pnpm run prisma:generate

# Run migrations to create tables
pnpm run prisma:migrate

# Seed the database with test data (10 vendors, 100 products)
pnpm run seeds:dev
```

### 5. Start the Server

```bash
pnpm run dev
```

API will be available at `http://localhost:5000/api/v1`.

---

## 🐳 Docker Setup

### build and Run

```bash
# Build the image
docker build -t casagen-api .

# Run the container
docker run -p 5000:5000 --env-file .env casagen-api
```

---

## 🛠️ Project Structure

- `src/features`: core business logic divided by modules (auth, produce, rental-space, etc.).
- `src/shared`: Global helpers, decorators, and shared services (DB, Redis).
- `src/generated`: Prisma generated client.
- `prisma/`: Database schema and migrations.

## 🔑 Key Features

- **RBHAC:** Admin, Vendor, and Customer roles.
- **Produce Marketplace:** Stock-checked ordering and vendor management.
- **Garden Rentals:** Location-based plot booking.
- **Plant Tracking:** Real-time growth status and health updates.
- **Community Forum:** Knowledge sharing hub.
- **Rate Limiting:** Protects auth routes and global API traffic.

## 📝 API Documentation

Detailed documentation including entry points and performance strategy can be found in [PROJECT_DELIVERABLES.md](./PROJECT_DELIVERABLES.md).

---

## 📜 License

This project is licensed under the ISC License.

# OpenBoxes Lite

A lightweight, modern inventory management system inspired by [OpenBoxes](https://openboxes.com), focused on **medicine donation tracking**.

Built for the Armanious Foundation / ESP team to manage near-expiry medicine stock, lots, and NGO distribution.

## Features

- **Dashboard** – KPIs, near-expiry alerts, recent transactions
- **Products** – Catalog of medicines with codes, categories, prices
- **Inventory** – Lot + expiry tracking, bin locations, stock adjustments
- **Transactions** – Receipt / issue history
- **Neon Postgres** – Persistent multi-user storage via Prisma
- **Seed data** – Pre-loaded with the latest “Available Medicines for donation” list (29 lots)

## Tech Stack

- Next.js 14 (App Router)
- TypeScript + Tailwind CSS
- Prisma + Neon (serverless Postgres)
- date-fns, lucide-react

## Quick Start

```bash
git clone https://github.com/ArmaniousESP/openboxes-lite.git
cd openboxes-lite
npm install

# 1. Create .env from the example
cp .env.example .env
# Edit .env and set DATABASE_URL to your Neon connection string

# 2. Create tables on Neon
npm run db:push

# 3. Seed medicine donation data
npm run db:seed

# 4. Run the app
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Optional: browse data with `npm run db:studio`.

## Neon / Vercel setup

1. Create a Neon database (or use the one you already have).
2. Copy the connection string into `.env` as `DATABASE_URL`.
3. On Vercel: Project → Settings → Environment Variables → add `DATABASE_URL` for Production / Preview / Development.
4. Deploy. The `postinstall` script runs `prisma generate` automatically.

**Never commit `.env`** — it is gitignored. Only `.env.example` is in the repo.

## Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import this repository.
2. Add the `DATABASE_URL` environment variable.
3. Click **Deploy**.

## Mapping from original OpenBoxes concepts

| OpenBoxes              | OpenBoxes Lite          |
|------------------------|-------------------------|
| Product                | Product                 |
| Inventory Item (lot)   | InventoryItem           |
| Location / Bin         | binLocation (string)    |
| Transaction            | Transaction             |
| Quantity on Hand       | quantity on InventoryItem |

## License

MIT – inspired by the open-source OpenBoxes project by Partners In Health.

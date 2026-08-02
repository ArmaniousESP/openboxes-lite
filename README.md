# OpenBoxes Lite

A lightweight, modern inventory management system inspired by [OpenBoxes](https://openboxes.com), focused on **medicine donation tracking**.

Built for the Armanious Foundation / ESP team to manage near-expiry medicine stock, lots, and NGO distribution.

## Features

- **Dashboard** – KPIs, near-expiry alerts, recent transactions
- **Products** – Catalog of medicines with codes, categories, prices
- **Inventory** – Lot + expiry tracking, bin locations, stock adjustments
- **Transactions** – Receipt / issue history
- **Seed data** – Pre-loaded with the latest “Available Medicines for donation” list (29 lots)

Data is stored in the browser (`localStorage`) so it works instantly on Vercel with no database required.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- date-fns
- lucide-react

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub (already done if you cloned from ArmaniousESP/openboxes-lite).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. Click **Deploy** — no environment variables needed.

Or use the Vercel CLI:

```bash
npx vercel
```

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

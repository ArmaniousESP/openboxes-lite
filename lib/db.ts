import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton for Next.js + Neon (serverless).
 * - Reuses the client across hot reloads in development
 * - Avoids exhausting Neon connection limits under concurrent serverless invocations
 *
 * Prefer a *pooled* DATABASE_URL from Neon (hostname often contains `-pooler`).
 * Use DIRECT_URL (non-pooled) only for migrations.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient() {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export type {
  Product,
  InventoryItem,
  Transaction,
  TransactionEntry,
  TransactionType,
} from "@prisma/client";

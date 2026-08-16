"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";
import type { TransactionType } from "@prisma/client";

// ─── Queries ─────────────────────────────────────────────────────────────────

export async function getProducts() {
  return prisma.product.findMany({
    where: { active: true },
    orderBy: { productCode: "asc" },
    include: {
      _count: { select: { inventoryItems: true } },
      inventoryItems: { select: { quantity: true } },
    },
  });
}

export async function getInventory(filter: "all" | "near" | "expired" = "all") {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in90 = new Date(today);
  in90.setDate(in90.getDate() + 90);

  if (filter === "near") {
    return prisma.inventoryItem.findMany({
      where: {
        quantity: { gt: 0 },
        expirationDate: { gte: today, lte: in90 },
      },
      include: { product: true },
      orderBy: { expirationDate: "asc" },
    });
  }

  if (filter === "expired") {
    return prisma.inventoryItem.findMany({
      where: {
        quantity: { gt: 0 },
        expirationDate: { lt: today },
      },
      include: { product: true },
      orderBy: { expirationDate: "asc" },
    });
  }

  return prisma.inventoryItem.findMany({
    include: { product: true },
    orderBy: { expirationDate: "asc" },
  });
}

export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in90 = new Date(today);
  in90.setDate(in90.getDate() + 90);

  const [productCount, inventory, nearExpiry, expired, recentTransactions] =
    await Promise.all([
      prisma.product.count({ where: { active: true } }),
      prisma.inventoryItem.findMany({
        include: { product: { select: { unitPrice: true } } },
      }),
      prisma.inventoryItem.findMany({
        where: {
          quantity: { gt: 0 },
          expirationDate: { gte: today, lte: in90 },
        },
        include: { product: true },
        orderBy: { expirationDate: "asc" },
        take: 8,
      }),
      prisma.inventoryItem.count({
        where: {
          quantity: { gt: 0 },
          expirationDate: { lt: today },
        },
      }),
      prisma.transaction.findMany({
        take: 10,
        orderBy: { date: "desc" },
        include: {
          entries: {
            include: {
              inventoryItem: { include: { product: true } },
            },
          },
        },
      }),
    ]);

  const totalQty = inventory.reduce((s, i) => s + i.quantity, 0);
  const totalValue = inventory.reduce((s, i) => {
    const price = i.product.unitPrice ? Number(i.product.unitPrice) : 0;
    return s + i.quantity * price;
  }, 0);

  return {
    productCount,
    lotCount: inventory.length,
    totalQty,
    nearExpiryCount: nearExpiry.length,
    nearExpiry,
    expiredCount: expired,
    totalValue,
    recentTransactions,
  };
}

export async function getTransactions(limit = 100) {
  return prisma.transaction.findMany({
    orderBy: { date: "desc" },
    take: Math.min(limit, 500),
    include: {
      entries: {
        include: {
          inventoryItem: { include: { product: true } },
        },
      },
    },
  });
}

// ─── Mutations ───────────────────────────────────────────────────────────────

export async function adjustStock(
  inventoryItemId: string,
  delta: number,
  notes?: string
): Promise<{ success: true } | { error: string }> {
  if (!inventoryItemId) return { error: "Inventory item is required" };
  if (!Number.isFinite(delta) || delta === 0) {
    return { error: "Quantity must be a non-zero number" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const item = await tx.inventoryItem.findUnique({
        where: { id: inventoryItemId },
      });
      if (!item) throw new Error("Inventory item not found");

      const newQty = Math.max(0, item.quantity + delta);
      await tx.inventoryItem.update({
        where: { id: inventoryItemId },
        data: { quantity: newQty },
      });

      const type: TransactionType = delta > 0 ? "RECEIPT" : "ISSUE";
      await tx.transaction.create({
        data: {
          type,
          notes: notes?.slice(0, 500) || undefined,
          entries: {
            create: {
              inventoryItemId,
              quantity: delta,
            },
          },
        },
      });
    });

    revalidatePath("/");
    revalidatePath("/inventory");
    revalidatePath("/transactions");
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to adjust stock";
    return { error: message };
  }
}

export async function addProduct(data: {
  productCode: string;
  name: string;
  category?: string;
  unitPrice?: number;
}): Promise<{ success: true; id: string } | { error: string }> {
  const code = data.productCode?.trim();
  const name = data.name?.trim();
  if (!code || !name) return { error: "Product code and name are required" };

  try {
    const product = await prisma.product.create({
      data: {
        productCode: code,
        name,
        description: name,
        category: data.category?.trim() || "Donation Stock",
        unitOfMeasure: "EA",
        lotAndExpiryControl: true,
        active: true,
        unitPrice: data.unitPrice != null ? data.unitPrice : undefined,
      },
    });
    revalidatePath("/products");
    return { success: true, id: product.id };
  } catch (e) {
    const message =
      e instanceof Error && e.message.includes("Unique constraint")
        ? `Product code "${code}" already exists`
        : e instanceof Error
          ? e.message
          : "Failed to create product";
    return { error: message };
  }
}

export async function addInventoryLot(data: {
  productId: string;
  lotNumber: string;
  expirationDate: string;
  quantity: number;
  binLocation: string;
  orgCode?: string;
}): Promise<{ success: true; id: string } | { error: string }> {
  if (!data.productId || !data.lotNumber?.trim()) {
    return { error: "Product and lot number are required" };
  }
  if (!data.expirationDate) return { error: "Expiration date is required" };
  if (!Number.isFinite(data.quantity) || data.quantity < 0) {
    return { error: "Quantity must be a non-negative number" };
  }

  try {
    const item = await prisma.inventoryItem.create({
      data: {
        productId: data.productId,
        lotNumber: data.lotNumber.trim(),
        expirationDate: new Date(data.expirationDate),
        quantity: data.quantity,
        binLocation: data.binLocation?.trim() || "Unassigned",
        orgCode: data.orgCode?.trim() || "PFA",
      },
    });

    if (data.quantity > 0) {
      await prisma.transaction.create({
        data: {
          type: "RECEIPT",
          notes: "Initial lot receipt",
          entries: {
            create: {
              inventoryItemId: item.id,
              quantity: data.quantity,
            },
          },
        },
      });
    }

    revalidatePath("/inventory");
    revalidatePath("/");
    revalidatePath("/transactions");
    return { success: true, id: item.id };
  } catch (e) {
    const message =
      e instanceof Error && e.message.includes("Unique constraint")
        ? "This product + lot number already exists"
        : e instanceof Error
          ? e.message
          : "Failed to create inventory lot";
    return { error: message };
  }
}

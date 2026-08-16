"use server";

import { prisma } from "./db";
import { revalidatePath } from "next/cache";

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: { productCode: "asc" },
    include: {
      _count: { select: { inventoryItems: true } },
      inventoryItems: { select: { quantity: true } },
    },
  });
}

export async function getInventory(filter?: "all" | "near" | "expired") {
  const items = await prisma.inventoryItem.findMany({
    include: { product: true },
    orderBy: { expirationDate: "asc" },
  });

  const today = new Date();
  const in90 = new Date();
  in90.setDate(today.getDate() + 90);

  if (filter === "near") {
    return items.filter(
      (i) => i.quantity > 0 && i.expirationDate >= today && i.expirationDate <= in90
    );
  }
  if (filter === "expired") {
    return items.filter((i) => i.quantity > 0 && i.expirationDate < today);
  }
  return items;
}

export async function getDashboardStats() {
  const [products, inventory, transactions] = await Promise.all([
    prisma.product.count(),
    prisma.inventoryItem.findMany({ include: { product: true } }),
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

  const today = new Date();
  const in90 = new Date();
  in90.setDate(today.getDate() + 90);

  const totalQty = inventory.reduce((s, i) => s + i.quantity, 0);
  const nearExpiry = inventory.filter(
    (i) => i.quantity > 0 && i.expirationDate >= today && i.expirationDate <= in90
  );
  const expired = inventory.filter((i) => i.quantity > 0 && i.expirationDate < today);
  const totalValue = inventory.reduce(
    (s, i) => s + i.quantity * (i.product.unitPrice ?? 0),
    0
  );

  return {
    productCount: products,
    lotCount: inventory.length,
    totalQty,
    nearExpiryCount: nearExpiry.length,
    nearExpiry: nearExpiry.slice(0, 8),
    expiredCount: expired.length,
    totalValue,
    recentTransactions: transactions,
  };
}

export async function adjustStock(
  inventoryItemId: string,
  delta: number,
  notes?: string
) {
  if (!delta) return { error: "Quantity required" };

  await prisma.$transaction(async (tx) => {
    const item = await tx.inventoryItem.findUnique({ where: { id: inventoryItemId } });
    if (!item) throw new Error("Inventory item not found");

    const newQty = Math.max(0, item.quantity + delta);
    await tx.inventoryItem.update({
      where: { id: inventoryItemId },
      data: { quantity: newQty },
    });

    await tx.transaction.create({
      data: {
        type: delta >= 0 ? "RECEIPT" : "ISSUE",
        notes: notes || undefined,
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
}

export async function addProduct(data: {
  productCode: string;
  name: string;
  category?: string;
  unitPrice?: number;
}) {
  const product = await prisma.product.create({
    data: {
      productCode: data.productCode,
      name: data.name,
      description: data.name,
      category: data.category || "Donation Stock",
      unitOfMeasure: "EA",
      lotAndExpiryControl: true,
      active: true,
      unitPrice: data.unitPrice,
    },
  });
  revalidatePath("/products");
  return product;
}

export async function getTransactions() {
  return prisma.transaction.findMany({
    orderBy: { date: "desc" },
    take: 100,
    include: {
      entries: {
        include: {
          inventoryItem: { include: { product: true } },
        },
      },
    },
  });
}

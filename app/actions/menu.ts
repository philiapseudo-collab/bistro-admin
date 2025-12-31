"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function toggleStock(id: number, currentStock: number) {
  try {
    // Toggle: if stock > 0, set to 0; if stock = 0, set to 100
    const newStock = currentStock > 0 ? 0 : 100;

    await db.menu.update({
      where: { id },
      data: { stock: newStock },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error toggling stock:", error);
    return { success: false, error: "Failed to update stock" };
  }
}

export async function updatePrice(id: number, newPrice: number) {
  try {
    // Prisma 7 automatically converts number to Decimal for Decimal fields
    await db.menu.update({
      where: { id },
      data: { price: newPrice },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating price:", error);
    return { success: false, error: "Failed to update price" };
  }
}


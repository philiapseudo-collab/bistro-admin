"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function resolveFeedback(id: string) {
  try {
    await db.feedback.update({
      where: { id },
      data: { status: "RESOLVED" },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error resolving feedback:", error);
    return { success: false, error: "Failed to resolve feedback" };
  }
}


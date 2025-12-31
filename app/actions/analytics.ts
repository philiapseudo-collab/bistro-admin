"use server";

import { db } from "@/lib/db";

// Get start of today in Africa/Nairobi timezone
function getStartOfTodayNairobi(): Date {
  const now = new Date();
  
  // Get current date in Nairobi timezone (YYYY-MM-DD format)
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Africa/Nairobi",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  
  const nairobiDateStr = formatter.format(now); // Returns "YYYY-MM-DD"
  
  // Create date string for 00:00:00 in Nairobi
  const dateStr = `${nairobiDateStr}T00:00:00`;
  
  // Use a more reliable method: create date and adjust for timezone offset
  // Nairobi is UTC+3, so we need to subtract 3 hours from UTC to get Nairobi midnight
  const tempDate = new Date(dateStr + "Z"); // Treat as UTC
  const nairobiOffset = 3 * 60 * 60 * 1000; // 3 hours in milliseconds
  return new Date(tempDate.getTime() - nairobiOffset);
}

export async function getDailyRevenue() {
  try {
    const startOfToday = getStartOfTodayNairobi();
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    const orders = await db.order.findMany({
      where: {
        createdAt: {
          gte: startOfToday,
          lt: endOfToday,
        },
        status: "PAID", // Only count paid orders
      },
      select: {
        totalAmount: true,
      },
    });

    const total = orders.reduce((sum: number, order: { totalAmount: unknown }) => {
      return sum + Number(order.totalAmount);
    }, 0);

    return {
      success: true,
      amount: total,
      formatted: new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(total),
    };
  } catch (error) {
    console.error("Error fetching daily revenue:", error);
    return {
      success: false,
      amount: 0,
      formatted: new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(0),
    };
  }
}

export async function getTopSellingItems() {
  try {
    const startOfToday = getStartOfTodayNairobi();
    const endOfToday = new Date(startOfToday);
    endOfToday.setDate(endOfToday.getDate() + 1);

    // Step A: Group by menuId and sum quantities, get top 5 (only today's orders)
    const orderItems = await db.orderItem.findMany({
      where: {
        Order: {
          createdAt: {
            gte: startOfToday,
            lt: endOfToday,
          },
          status: "PAID",
        },
      },
      include: {
        Order: {
          select: {
            status: true,
          },
        },
      },
    });

    // Group by menuId and sum quantities
    const grouped = orderItems.reduce((acc: Record<number, number>, item: { menuId: number; quantity: number }) => {
        const menuId = item.menuId;
        if (!acc[menuId]) {
          acc[menuId] = 0;
        }
        acc[menuId] += item.quantity;
        return acc;
      }, {} as Record<number, number>);

    // Get top 5 by quantity
    const top5MenuIds = (Object.entries(grouped) as [string, number][])
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([menuId]) => parseInt(menuId));

    // Step B: Fetch menu names for these IDs
    const menus = await db.menu.findMany({
      where: {
        id: {
          in: top5MenuIds,
        },
      },
      select: {
        id: true,
        name: true,
      },
    });

    // Combine data
    const result = top5MenuIds
      .map((menuId) => {
        const menu = menus.find((m) => m.id === menuId);
        return {
          name: menu?.name || `Item #${menuId}`,
          quantity: grouped[menuId],
        };
      })
      .filter((item) => item.quantity > 0);

    return {
      success: true,
      items: result,
    };
  } catch (error) {
    console.error("Error fetching top selling items:", error);
    return {
      success: false,
      items: [],
    };
  }
}


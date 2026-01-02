import { Header } from "@/components/Header";
import { DashboardTabs } from "@/components/DashboardTabs";
import { db } from "@/lib/db";
import { getDailyRevenue, getTopSellingItems } from "@/app/actions/analytics";

type MenuItem = Omit<Awaited<ReturnType<typeof db.menu.findMany>>[number], 'price'> & { price: number };
type FeedbackItem = Awaited<ReturnType<typeof db.feedback.findMany>>[number];

export default async function Home() {
  let menuItems: MenuItem[] = [];
  let feedbackItems: FeedbackItem[] = [];
  let dailyRevenue = "KES 0";
  let topItems: { name: string; quantity: number }[] = [];
  let error = null;

  try {
    // Fetch all menu items ordered by category
    const items = await db.menu.findMany({
      orderBy: { category: "asc" },
    });
    
    // Convert Decimal to number for client components
    menuItems = items.map((item: Awaited<ReturnType<typeof db.menu.findMany>>[number]) => ({
      ...item,
      price: Number(item.price),
    }));

    // Fetch all feedback (both admin and chatbot entries)
    const allFeedback = await db.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Transform feedback to unified format for components
    // Chatbot entries use 'comment' (or no comment), admin entries use 'message'
    feedbackItems = allFeedback.map((item) => {
      // If it's a chatbot entry (no message field), transform it
      if (!item.message) {
        return {
          ...item,
          message: item.comment || `Customer rated ${item.rating} star${item.rating !== 1 ? 's' : ''}`, // Use comment or default message
          type: item.rating <= 3 ? "COMPLAINT" : "COMPLIMENT", // Derive type from rating
          status: null, // Chatbot entries don't have status
        };
      }
      // Admin entries already have message, type, status
      return item;
    });

    // Fetch analytics data
    const revenueResult = await getDailyRevenue();
    if (revenueResult.success) {
      dailyRevenue = revenueResult.formatted;
    }

    const topItemsResult = await getTopSellingItems();
    if (topItemsResult.success) {
      topItems = topItemsResult.items;
    }
  } catch (err: any) {
    // Handle case where table doesn't exist
    if (err?.code === "P2021" || err?.message?.includes("does not exist")) {
      error = "TABLE_NOT_FOUND";
    } else {
      error = "UNKNOWN";
      console.error("Error fetching data:", err);
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
        <Header />
        <main className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {error === "TABLE_NOT_FOUND" ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-800 dark:bg-amber-900/20">
              <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-2">
                Database Tables Not Found
              </h2>
              <p className="text-amber-800 dark:text-amber-200 mb-4">
                The required tables do not exist in the connected database.
              </p>
            </div>
          ) : (
            <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-800 dark:bg-red-900/20">
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                Database Error
              </h2>
              <p className="text-red-800 dark:text-red-200">
                An error occurred while fetching data. Please check your database connection.
              </p>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="w-full max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <DashboardTabs
          menuItems={menuItems}
          feedbackItems={feedbackItems}
          dailyRevenue={dailyRevenue}
          topItems={topItems}
        />
      </main>
    </div>
  );
}

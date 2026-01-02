"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MenuList } from "@/components/MenuList";
import { FeedbackList } from "@/components/FeedbackList";
import { RevenueCard } from "@/components/analytics/RevenueCard";
import { TopItemsChart } from "@/components/analytics/TopItemsChart";

type Menu = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string | null;
  subcategory: string | null;
};

type Feedback = {
  id: string;
  createdAt: Date;
  rating: number;
  message: string | null;
  type: string | null;
  status: string | null;
  tableNumber: string | null;
  waiterName: string | null;
};

interface DashboardTabsProps {
  menuItems: Menu[];
  feedbackItems: Feedback[];
  dailyRevenue: string;
  topItems: { name: string; quantity: number }[];
}

export function DashboardTabs({
  menuItems,
  feedbackItems,
  dailyRevenue,
  topItems,
}: DashboardTabsProps) {
  return (
    <Tabs defaultValue="menu" className="w-full">
      <TabsList className="grid w-full max-w-lg grid-cols-3 mb-6">
        <TabsTrigger value="menu">Menu Management</TabsTrigger>
        <TabsTrigger value="feedback">Customer Feedback</TabsTrigger>
        <TabsTrigger value="insights">Insights</TabsTrigger>
      </TabsList>

      <TabsContent value="menu">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Menu Manager
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Manage menu items, prices, and stock availability
          </p>
        </div>
        <MenuList menuItems={menuItems} />
      </TabsContent>

      <TabsContent value="feedback">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Customer Feedback
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Monitor and respond to customer reviews
          </p>
        </div>
        <FeedbackList feedbackItems={feedbackItems} />
      </TabsContent>

      <TabsContent value="insights">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Analytics & Insights
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Business performance metrics and trends
          </p>
        </div>
        <div className="space-y-6">
          <RevenueCard revenue={dailyRevenue} />
          <TopItemsChart items={topItems} />
        </div>
      </TabsContent>
    </Tabs>
  );
}


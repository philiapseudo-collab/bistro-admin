"use client";

import { useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FeedbackCard } from "@/components/FeedbackCard";
import type { Feedback } from "@prisma/client";
import { MessageSquareOff } from "lucide-react";

interface FeedbackListProps {
  feedbackItems: Feedback[];
}

export function FeedbackList({ feedbackItems }: FeedbackListProps) {
  // Filter feedback for "Live" tab: Pending complaints + Recent compliments (last 24h)
  const liveFeedback = useMemo(() => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return feedbackItems.filter((item) => {
      if (item.type === "COMPLAINT" && item.status === "PENDING") {
        return true;
      }
      if (
        item.type === "COMPLIMENT" &&
        new Date(item.createdAt) >= twentyFourHoursAgo
      ) {
        return true;
      }
      return false;
    });
  }, [feedbackItems]);

  // Filter feedback for "History" tab: Resolved complaints + Older messages
  const historyFeedback = useMemo(() => {
    const now = new Date();
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    return feedbackItems.filter((item) => {
      if (item.type === "COMPLAINT" && item.status === "RESOLVED") {
        return true;
      }
      if (
        item.type === "COMPLIMENT" &&
        new Date(item.createdAt) < twentyFourHoursAgo
      ) {
        return true;
      }
      return false;
    });
  }, [feedbackItems]);

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <MessageSquareOff className="h-12 w-12 text-zinc-400 dark:text-zinc-600 mb-4" />
      <p className="text-zinc-500 dark:text-zinc-400">{message}</p>
    </div>
  );

  return (
    <Tabs defaultValue="live" className="w-full">
      <TabsList className="grid w-full max-w-md grid-cols-2">
        <TabsTrigger value="live">
          Live {liveFeedback.length > 0 && `(${liveFeedback.length})`}
        </TabsTrigger>
        <TabsTrigger value="history">
          History {historyFeedback.length > 0 && `(${historyFeedback.length})`}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="live" className="mt-6">
        {liveFeedback.length === 0 ? (
          <EmptyState message="No feedback yet! 📭" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveFeedback.map((item) => (
              <FeedbackCard key={item.id} feedback={item} />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="history" className="mt-6">
        {historyFeedback.length === 0 ? (
          <EmptyState message="No history yet! 📭" />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {historyFeedback.map((item) => (
              <FeedbackCard key={item.id} feedback={item} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}


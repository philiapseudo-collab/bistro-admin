"use client";

import { useState, useTransition } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { resolveFeedback } from "@/app/actions/feedback";
import { Star } from "lucide-react";

type Feedback = {
  id: string;
  createdAt: Date;
  rating: number;
  message: string;
  type: string;
  status: string;
  tableNumber: string | null;
  waiterName: string | null;
};

interface FeedbackCardProps {
  feedback: Feedback;
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const [isPending, startTransition] = useTransition();
  const isHighRating = feedback.rating >= 4;
  const isComplaint = feedback.type === "COMPLAINT";
  const isPendingComplaint = isComplaint && feedback.status === "PENDING";

  const handleResolve = () => {
    startTransition(async () => {
      await resolveFeedback(feedback.id);
    });
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating
            ? "fill-yellow-400 text-yellow-400"
            : "fill-zinc-200 text-zinc-200 dark:fill-zinc-700 dark:text-zinc-700"
        }`}
      />
    ));
  };

  return (
    <Card
      className={`${
        isHighRating
          ? "border-l-4 border-l-green-500"
          : "border-l-4 border-l-red-500"
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">{renderStars(feedback.rating)}</div>
          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {formatDate(feedback.createdAt)}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-zinc-900 dark:text-zinc-50">{feedback.message}</p>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {feedback.tableNumber && (
            <Badge variant="outline" className="text-xs">
              Table #{feedback.tableNumber}
            </Badge>
          )}
          {feedback.waiterName && (
            <Badge variant="outline" className="text-xs">
              Waiter: {feedback.waiterName}
            </Badge>
          )}
          {isComplaint && (
            <Badge
              variant={feedback.status === "PENDING" ? "destructive" : "secondary"}
              className="text-xs"
            >
              {feedback.type}
            </Badge>
          )}
        </div>
        {isPendingComplaint && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleResolve}
            disabled={isPending}
          >
            Mark Resolved
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}


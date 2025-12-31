import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface RevenueCardProps {
  revenue: string;
}

export function RevenueCard({ revenue }: RevenueCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300">
          <DollarSign className="h-5 w-5" />
          Total Revenue Today
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          {revenue}
        </p>
      </CardContent>
    </Card>
  );
}


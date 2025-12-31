"use client";

import { useState, useTransition } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toggleStock, updatePrice } from "@/app/actions/menu";

type Menu = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string | null;
  subcategory: string | null;
};

interface MenuCardProps {
  menuItem: Menu;
}

export function MenuCard({ menuItem }: MenuCardProps) {
  const [price, setPrice] = useState(menuItem.price.toString());
  const [isPending, startTransition] = useTransition();
  const isInStock = menuItem.stock > 0;

  const handleStockToggle = (checked: boolean) => {
    startTransition(async () => {
      await toggleStock(menuItem.id, menuItem.stock);
    });
  };

  const handlePriceUpdate = () => {
    const numPrice = parseFloat(price);
    if (!isNaN(numPrice) && numPrice >= 0 && numPrice !== parseFloat(menuItem.price.toString())) {
      startTransition(async () => {
        await updatePrice(menuItem.id, numPrice);
      });
    } else {
      // Reset to original price if invalid
      setPrice(menuItem.price.toString());
    }
  };

  const handlePriceKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur(); // This will trigger handlePriceUpdate via onBlur
    }
  };

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {menuItem.name}
            </CardTitle>
            <CardDescription className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              {menuItem.category}
              {menuItem.subcategory && ` • ${menuItem.subcategory}`}
            </CardDescription>
          </div>
          <CardAction>
            <Switch
              checked={isInStock}
              onCheckedChange={handleStockToggle}
              disabled={isPending}
              className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-zinc-300"
            />
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <label htmlFor={`price-${menuItem.id}`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Price:
          </label>
          <Input
            id={`price-${menuItem.id}`}
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={handlePriceUpdate}
            onKeyDown={handlePriceKeyDown}
            disabled={isPending}
            className="flex-1"
          />
        </div>
      </CardContent>
    </Card>
  );
}


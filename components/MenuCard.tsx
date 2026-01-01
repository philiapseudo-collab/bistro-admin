"use client";

import { useState, useTransition, useOptimistic, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleStock, updatePrice, updateStockCount } from "@/app/actions/menu";

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
  const [stockInput, setStockInput] = useState(menuItem.stock.toString());
  const [isPending, startTransition] = useTransition();
  
  // Optimistic stock state for immediate UI updates
  const [optimisticStock, setOptimisticStock] = useOptimistic(
    menuItem.stock,
    (currentStock: number, newStock: number) => newStock
  );

  // Sync input field when menuItem prop changes (after server revalidation)
  useEffect(() => {
    setStockInput(menuItem.stock.toString());
  }, [menuItem.stock]);

  const isInStock = optimisticStock > 0;
  const isLowStock = optimisticStock > 0 && optimisticStock <= 5;

  const handleStockToggle = (checked: boolean) => {
    const newStock = optimisticStock > 0 ? 0 : 20;
    setOptimisticStock(newStock);
    setStockInput(newStock.toString());
    
    startTransition(async () => {
      await toggleStock(menuItem.id, optimisticStock);
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

  const handleStockIncrement = () => {
    const newStock = optimisticStock + 1;
    setOptimisticStock(newStock);
    setStockInput(newStock.toString());
    
    startTransition(async () => {
      await updateStockCount(menuItem.id, newStock);
    });
  };

  const handleStockDecrement = () => {
    const newStock = Math.max(0, optimisticStock - 1);
    setOptimisticStock(newStock);
    setStockInput(newStock.toString());
    
    // Auto-uncheck switch if stock becomes 0
    if (newStock === 0) {
      startTransition(async () => {
        await updateStockCount(menuItem.id, 0);
      });
    } else {
      startTransition(async () => {
        await updateStockCount(menuItem.id, newStock);
      });
    }
  };

  const handleStockUpdate = () => {
    const numStock = parseInt(stockInput, 10);
    if (!isNaN(numStock) && numStock >= 0 && numStock !== optimisticStock) {
      setOptimisticStock(numStock);
      
      // Auto-uncheck switch if stock is 0
      if (numStock === 0) {
        startTransition(async () => {
          await updateStockCount(menuItem.id, 0);
        });
      } else {
        startTransition(async () => {
          await updateStockCount(menuItem.id, numStock);
        });
      }
    } else {
      // Reset to current stock if invalid
      setStockInput(optimisticStock.toString());
    }
  };

  const handleStockKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur(); // This will trigger handleStockUpdate via onBlur
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
      <CardContent className="space-y-4">
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
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label htmlFor={`stock-${menuItem.id}`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Inventory:
            </label>
            {isLowStock && (
              <Badge variant="destructive" className="text-xs">
                Low Stock
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleStockDecrement}
              disabled={optimisticStock === 0}
              className="h-9 w-9 shrink-0"
            >
              -
            </Button>
            <Input
              id={`stock-${menuItem.id}`}
              type="number"
              min="0"
              value={stockInput}
              onChange={(e) => setStockInput(e.target.value)}
              onBlur={handleStockUpdate}
              onKeyDown={handleStockKeyDown}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleStockIncrement}
              className="h-9 w-9 shrink-0"
            >
              +
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


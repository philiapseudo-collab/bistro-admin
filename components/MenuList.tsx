"use client";

import { useState, useMemo } from "react";
import { MenuCard } from "@/components/MenuCard";
import { MenuSearch } from "@/components/MenuSearch";

type Menu = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string | null;
  subcategory: string | null;
};

interface MenuListProps {
  menuItems: Menu[];
}

export function MenuList({ menuItems }: MenuListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter menu items by name OR category (case-insensitive)
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return menuItems;
    }

    const query = searchQuery.toLowerCase().trim();
    return menuItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        (item.subcategory && item.subcategory.toLowerCase().includes(query))
    );
  }, [menuItems, searchQuery]);

  return (
    <div className="w-full space-y-6">
      <MenuSearch value={searchQuery} onChange={setSearchQuery} />
      
      {filteredItems.length === 0 ? (
        <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
          <p>No menu items found matching &quot;{searchQuery}&quot;</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <MenuCard key={item.id} menuItem={item} />
          ))}
        </div>
      )}
    </div>
  );
}


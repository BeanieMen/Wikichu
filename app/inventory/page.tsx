"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import InventoryTable from "../components/InventoryTable";

interface Item {
  name: string;
  sourceUrl: string;
  rarity: number;
  stickerDesc: string;
}

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchItems = async () => {
      if (!user) {
        console.log("No user found!");
        return;
      }

      const userId = user.id;
      const response = await fetch("/api/getStickersForUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data: Item[] = await response.json();
      setItems(data);
    };

    fetchItems();
  }, [user]);

  return (
    <div>
      <InventoryTable items={items} />
    </div>
  );
}

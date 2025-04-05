"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react"; // Import Clerk's useUser hook
import InventoryTable from "../components/inventoryTable"; // Assuming the component is in the 'components' folder

interface Item {
  name: string;
  sourceUrl: string;
  rarity: number;
  stickerDesc: string;
}

export default function InventoryPage() {
  const [items, setItems] = useState<Item[]>([]);
  const { user } = useUser(); // Get current user from Clerk

  useEffect(() => {
    const fetchItems = async () => {
      if (!user) {
        console.log("No user found!");
        return;
      }

      const userId = user.id; // Get Clerk user ID
      const response = await fetch("/api/getStickersForUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }), // Send userId in the request body
      });

      const data: Item[] = await response.json();
      setItems(data);
    };

    fetchItems();
  }, [user]); // Only run this when the user is available

  return (
    <div>
      <InventoryTable items={items} />
    </div>
  );
}

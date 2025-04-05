"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect } from "react";

interface Sticker {
  name: string;
  sourceUrl: string;
  rarity: number;
  stickerDesc: string;
}

interface InventoryTableProps {
  items: Sticker[];
}

export default function InventoryPage({ items }: InventoryTableProps) {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      console.log("User ID:", user.id);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-yellow-50 p-8 flex flex-col items-center">
      <nav className="w-full bg-[#F6CF57] p-4 rounded-xl flex justify-between max-w-6xl items-center mb-8 shadow-md">
        <h1
          className="text-4xl font-bold text-black"
          style={{ fontFamily: "Pokemon" }}
        >
          WikiChu
        </h1>
        <div className="flex items-center space-x-6">
          <div className="text-lg font-semibold text-gray-700">Inventory</div>
          <UserButton
            appearance={{
              elements: {
                avatarBox: { width: "3.5rem", height: "3.5rem" },
              },
            }}
          />
        </div>
      </nav>

      <div className="w-full max-w-6xl bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your Sticker Inventory
        </h2>
        {items.length === 0 ? (
          <p className="text-gray-600">You don’t have any stickers yet!</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((sticker, index) => (
              <div
                key={index}
                className="bg-yellow-100 rounded-xl p-4 shadow hover:shadow-lg transition duration-200"
              >
                <img
                  src={sticker.sourceUrl}
                  alt={sticker.name}
                  className="w-full h-40 object-contain mb-3 rounded"
                />
                <h3 className="text-lg font-bold text-gray-800">
                  {sticker.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {sticker.stickerDesc}
                </p>
                <div className="text-sm font-semibold text-gray-700">
                  Rarity:{" "}
                  <span
                    className={`${
                      sticker.rarity > 4
                        ? "text-purple-700"
                        : sticker.rarity > 2
                          ? "text-yellow-600"
                          : "text-gray-600"
                    }`}
                  >
                    {sticker.rarity}/5
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

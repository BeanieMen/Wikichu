"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface Sticker {
  name: string;
  sourceUrl: string;
  rarity: number;
  stickerDesc: string;
}

interface InventoryTableProps {
  items: Sticker[];
}

export default function InventoryPokédex({ items }: InventoryTableProps) {
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
          WikiDex
        </h1>
        <div className="flex items-center space-x-6">
          <Link href={"/"} className="text-gray-700">
            WikiChu
          </Link>
          <Link href={"/marketplace"} className="text-gray-700">
            Marketplace
          </Link>

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
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Your StickerDex ({items.length}/151)
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {items.map((sticker, index) => (
            <div
              key={index}
              className="bg-yellow-100 rounded-xl p-4 shadow hover:shadow-lg transition duration-200 flex flex-col"
            >
              <div className="text-sm text-gray-500 mb-1 font-mono">
                #{String(index + 1).padStart(3, "0")}
              </div>
              <Image
                src={sticker.sourceUrl}
                alt={sticker.name}
                width={500}
                height={500}
                className="w-full h-32 object-contain mb-3 rounded"
              />

              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {sticker.name[0].toUpperCase() + sticker.name.split('').splice(1).join('').split('_')[0].split(".")[0].toLowerCase()}
              </h3>
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                {sticker.stickerDesc}
              </p>
              <div className="mt-auto text-sm font-semibold text-gray-700">
                Rarity:
                <span
                  className={`${
                    sticker.rarity >= 5
                      ? "text-purple-700"
                      : sticker.rarity >= 3
                      ? "text-yellow-600"
                      : "text-gray-600"
                  }`}
                >
                  {" "} {sticker.rarity}/4
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

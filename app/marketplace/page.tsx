"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// Define a type for our chest items
interface ChestItem {
  id: string;
  name: string;
  imagePath: string;
  price: number;
  rarity: "common" | "uncommon" | "epic" | "legendary";
}

// Define the chest data
const chests: ChestItem[] = [
  {
    id: "common-chest",
    name: "Common Chest",
    imagePath: "/chests/common.png",
    price: 50,
    rarity: "common",
  },
  {
    id: "uncommon-chest",
    name: "Uncommon Chest",
    imagePath: "/chests/uncommon.png",
    price: 150,
    rarity: "uncommon",
  },
  {
    id: "epic-chest",
    name: "Epic Chest",
    imagePath: "/chests/epic.png",
    price: 500,
    rarity: "epic",
  },
  {
    id: "legendary-chest",
    name: "Legendary Chest",
    imagePath: "/chests/legendary.png",
    price: 1500,
    rarity: "legendary",
  },
];

// Extend the popup data type to include an optional image URL
interface PopupData {
  title: string;
  message: string;
  imageUrl?: string;
}

export default function MarketplacePage() {
  const { user } = useUser();
  const [popup, setPopup] = useState<PopupData | null>(null);

  // Function to map chest rarity string to a number
  const mapRarity = (rarity: string): number => {
    if (rarity === "common") return 1;
    if (rarity === "uncommon") return 2;
    if (rarity === "epic") return 3;
    if (rarity === "legendary") return 4;
    return 1;
  };

  // Handle the purchase action
  const handlePurchase = async (chest: ChestItem) => {
    try {
      const res = await fetch("/api/purchase-chest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chestPrice: chest.price,
          chestRarity: mapRarity(chest.rarity),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPopup({
          title: "Purchase Failed",
          message: `Purchase failed: ${data.message}`,
        });
        return;
      }
      // Build the image URL by prepending "/pkmn/" to the sticker name
      const imageUrl = `/pkmn/${data.sticker.name}`;
      setPopup({
        title: "Purchase Successful!",
        message: `You received a sticker: ${data.sticker.name}\n${data.sticker.stickerDesc}`,
        imageUrl,
      });
    } catch (error: any) {
      setPopup({
        title: "Error",
        message: `An error occurred: ${error.message}`,
      });
    }
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8 flex flex-col items-center relative">
      <nav className="w-full bg-[#F6CF57] p-3 md:p-4 rounded-xl flex justify-between max-w-6xl items-center mb-6 md:mb-8 shadow-md">
        <Link href="/">
          <h1
            className="text-2xl md:text-4xl font-bold text-black cursor-pointer"
            style={{ fontFamily: "Pokemon, sans-serif" }}
          >
            Marketplace
          </h1>
        </Link>
        <div className="flex items-center space-x-3 md:space-x-6">
          <Link href="/" className="text-gray-700 hover:text-black">
            WikiChu
          </Link>
          <Link href="/wikidex" className="text-gray-700 hover:text-black">
            WikiDex
          </Link>
          <UserButton
            appearance={{
              elements: { avatarBox: "w-10 h-10 md:w-14 md:h-14" },
            }}
          />
        </div>
      </nav>

      {/* Main Marketplace Content Area */}
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center md:text-left">
          Item Shop
        </h2>

        {/* Chest Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {chests.map((chest) => (
            <div
              key={chest.id}
              className="bg-white rounded-xl p-4 md:p-6 shadow-md flex flex-col items-center text-center transition-transform duration-200 ease-in-out hover:scale-105 border border-gray-200"
            >
              <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4">
                <Image
                  src={chest.imagePath}
                  alt={chest.name}
                  layout="fill"
                  objectFit="contain"
                  priority={chest.rarity === "legendary"}
                />
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                {chest.name}
              </h3>

              <div className="flex items-center justify-center text-base md:text-lg text-gray-700 mb-4">
                <span className="font-bold">{chest.price}</span>
                <span className="ml-1.5">🪙</span>
                <span className="ml-1 text-sm text-gray-600">Coins</span>
              </div>

              <button
                onClick={() => handlePurchase(chest)}
                className="w-full bg-[#F6CF57] hover:bg-yellow-500 text-black font-bold py-2 px-5 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
              >
                Purchase
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popup Modal */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{popup.title}</h3>
            {/* Display the sticker image if available */}
            {popup.imageUrl && (
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={popup.imageUrl}
                  alt="Sticker Image"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            )}
            <p className="text-gray-700 whitespace-pre-line mb-6">{popup.message}</p>
            <button
              onClick={() => setPopup(null)}
              className="w-full bg-[#F6CF57] hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

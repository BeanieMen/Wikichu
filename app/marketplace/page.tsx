"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image"; // Import Next.js Image component
import { useState } from "react"; // If you need state for interactions later

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
    imagePath: "/chests/common.png", // Ensure this path is correct in your public folder
    price: 50,
    rarity: "common",
  },
  {
    id: "uncommon-chest",
    name: "Uncommon Chest",
    imagePath: "/chests/uncommon.png", // Ensure this path is correct
    price: 150,
    rarity: "uncommon",
  },
  {
    id: "epic-chest",
    name: "Epic Chest",
    imagePath: "/chests/epic.png", // Ensure this path is correct
    price: 500,
    rarity: "epic",
  },
  {
    id: "legendary-chest",
    name: "Legendary Chest",
    imagePath: "/chests/legendary.png", // Ensure this path is correct
    price: 1500,
    rarity: "legendary",
  },
];

export default function MarketplacePage() {
  // Placeholder function for handling purchase logic
  const handlePurchase = (chest: ChestItem) => {
    console.log(
      `Attempting to purchase ${chest.name} for ${chest.price} Coins.`
    );
    // TODO: Implement actual purchase logic here
    // This would likely involve:
    // 1. Checking if the user has enough coins (fetch user data if needed)
    // 2. Making an API call to your backend to process the purchase
    // 3. Updating the user's coin balance and inventory state
    // 4. Providing feedback to the user (success/error message)
    alert(`Purchase functionality for ${chest.name} not yet implemented.`);
  };

  return (
    <div className="min-h-screen bg-yellow-50 p-4 md:p-8 flex flex-col items-center">
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
              elements: {
                avatarBox: "w-10 h-10 md:w-14 md:h-14",
              },
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
              className="bg-white rounded-xl p-4 md:p-6 shadow-md flex flex-col items-center text-center transition-transform duration-200 ease-in-out hover:scale-105 border border-gray-200" // Added subtle border
            >
              {/* Chest Image Container */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 mb-4">
                <Image
                  src={chest.imagePath}
                  alt={`${chest.name}`}
                  layout="fill" // Fills the container
                  objectFit="contain" // Scales image down to fit, preserving aspect ratio
                  priority={chest.rarity === "legendary"} // Prioritize loading important images
                />
              </div>

              {/* Chest Name */}
              <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">
                {chest.name}
              </h3>

              {/* Chest Price */}
              <div className="flex items-center justify-center text-base md:text-lg text-gray-700 mb-4">
                <span className="font-bold">{chest.price}</span>
                {/* Simple coin emoji, replace with an SVG/Icon component if preferred */}
                <span className="ml-1.5">🪙</span>
                <span className="ml-1 text-sm text-gray-600">Coins</span>
              </div>

              {/* Purchase Button */}
              <button
                onClick={() => handlePurchase(chest)}
                className="w-full bg-[#F6CF57] hover:bg-yellow-500 text-black font-bold py-2 px-5 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75" // Added focus styles
              >
                Purchase
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

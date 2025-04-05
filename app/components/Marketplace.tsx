"use client";

import Image from "next/image";

interface Item {
  stickerName: string;
  stickerUrl: string;
  stickerDesc: string;
}

interface MarketPlaceProps {
  items: Item[];
}

export default function MarketPlace({ items }: MarketPlaceProps) {
  return (
    <div className="min-h-screen p-8 flex flex-col items-center bg-[#FFF9EB]">
      {" "}
      {/* Light yellow background */}
      <div className="w-full max-w-4xl bg-white/90 rounded-xl p-6 shadow-md backdrop-blur-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center tracking-wide">
          Sticker MarketPlace
        </h2>

        <div className="flex flex-col gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center bg-white rounded-xl p-4 shadow hover:shadow-lg transition duration-200 border-l-8 border-[#E9C46A]" // Light orange border
            >
              <Image
                src={item.stickerUrl}
                alt={item.stickerName}
                width={80}
                height={80}
                className="w-20 h-20 object-contain rounded mr-4"
              />
              <div className="flex flex-col flex-1">
                <h3 className="text-xl font-bold text-gray-800">
                  {item.stickerName}
                </h3>
                <p className="text-sm text-gray-600">{item.stickerDesc}</p>
              </div>
              <button className="ml-6 bg-[#E9C46A] hover:bg-[#F4A261] text-white font-semibold py-2 px-4 rounded shadow-inner transition">
                {" "}
                {/* Light orange button */}
                Buy
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

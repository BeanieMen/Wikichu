import Image from "next/image";

const rarityMap = ["common", "uncommon", "rare", "epic", "legendary"];

interface Item {
  name: string;
  sourceUrl: string;
  rarity: number;
  stickerDesc: string;
}

interface InventoryTableProps {
  items: Item[];
}

export default function InventoryTable({ items }: InventoryTableProps) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Inventory</h2>

      {/* Table Structure */}
      <div className="overflow-x-auto text-black">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border border-gray-300 text-center">
                Sticker
              </th>
              <th className="px-4 py-2 border border-gray-300 text-center">
                Name
              </th>
              <th className="px-4 py-2 border border-gray-300 text-center">
                Rarity
              </th>
              <th className="px-4 py-2 border border-gray-300 text-center">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="odd:bg-white even:bg-gray-50">
                {/* Image as a Table Column */}
                <td className="px-4 py-2 border border-gray-300 text-center">
                  <Image
                    alt={item.name}
                    src={"/globe.svg"}
                    width={50}
                    height={50}
                    className="rounded-md m-auto"
                  />
                </td>
                {/* Name as a Table Column */}
                <td className="px-4 py-2 border border-gray-300 text-center">
                  {item.name}
                </td>
                {/* Rarity as a Table Column */}
                <td className="px-4 py-2 border border-gray-300 text-center">
                  {rarityMap[item.rarity - 1]}
                </td>
                {/* Description as a Table Column */}
                <td className="px-4 py-2 border border-gray-300 text-center">
                  {item.stickerDesc}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

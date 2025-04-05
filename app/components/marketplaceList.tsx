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
    <ul className="bg-white m-4">
      {items.map((item, idx) => (
        <li className="list-none text-black p-4 m-4" key={idx}>
          <h3>{item.stickerName}</h3>
          <div className="mt-1 flex gap-1">
            <Image
              src={item.stickerUrl}
              alt={item.stickerName}
              width={200}
              height={200}
              className="border-[50%] w-[15svw] h-[svw]"
            />
            <p>{item.stickerDesc}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

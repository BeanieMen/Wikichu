import styles from "../cssmodules/inventory.module.css";
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
    <div>
      <div className={styles.parentDiv}>
        <h2 className={styles.h2Ele}>Inventory</h2>
        <div className={styles.tableDiv}></div>
      </div>
      <div>
        <div className={styles.itemGrid}>
          <p>Sticker</p>
          <p>Name</p>
          <p>Rarity</p>
          <p>Description</p>
          {items.map((item) => (
            <>
              <Image
                alt={item.name}
                src={item.sourceUrl}
                width={200}
                height={200}
                className={styles.imageEle}
              />
              <p>{item.name}</p>
              <p>{rarityMap[item.rarity - 1]}</p>
              <p>{item.stickerDesc}</p>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}

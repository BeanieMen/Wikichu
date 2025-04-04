import styles from "../cssmodules/inventory.module.css";
import Image from "next/image";
export default function InventoryList(
  items: { stickerUrl: string; stickerName: string; stickter: string }[],
) {
  return (
    <ul className={styles.itemUl}>
      {items.map((item, idx) => (
        <li className={styles.itemLi} key={idx}>
          <h3>{item.stickerName}</h3>
          <div className={styles.itemLiDiv}>
            <Image
              src={item.stickerUrl}
              alt={item.stickerName}
              width={200}
              height={200}
              className={styles.imageEle}
            />
            <p>{item.stickter}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

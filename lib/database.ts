import sqlite3 from "sqlite3";

export const database = new sqlite3.Database("main.db");

// 🧱 Initialize all tables
export function initDatabase() {
  const createUsersTable = `
      CREATE TABLE IF NOT EXISTS Users (
        id TEXT PRIMARY KEY, -- from Clerk
        money INTEGER NOT NULL DEFAULT 0,
      );`;

  const createStickersTable = `
      CREATE TABLE IF NOT EXISTS Stickers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        source_url TEXT NOT NULL,
        rarity INTEGER CHECK (rarity >= 1 AND rarity <= 4),
        stickerDesc TEXT NOT NULL
      );`;

  const createInventoryTable = `
      CREATE TABLE IF NOT EXISTS Inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        sticker_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (sticker_id) REFERENCES Stickers(id) ON DELETE CASCADE
      );`;

  database.serialize(() => {
    database.run(createUsersTable);
    database.run(createStickersTable);
    database.run(createInventoryTable);
  });
}

export interface UserSticker {
  name: string;
  sourceUrl: string;
  rarity: number;
  stickerDesc: string;
}

export async function addUser(id: string, money = 0): Promise<void> {
  return new Promise((resolve, reject) => {
    database.run(
      "INSERT OR IGNORE INTO Users (id, money) VALUES (?, ?)",
      [id, money],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export async function getUserById(
  userId: string
): Promise<{ id: string; money: number }> {
  return new Promise((resolve, reject) => {
    database.get("SELECT * FROM Users WHERE id = ?", [userId], (err, row) => {
      if (err) reject(err);
      else resolve(row as { id: string; money: number });
    });
  });
}

export async function addMoney(userId: string, amount: number): Promise<void> {
  return new Promise((resolve, reject) => {
    database.run(
      "UPDATE Users SET money = money + ? WHERE id = ?",
      [amount, userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export async function removeMoney(
  userId: string,
  amount: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    database.run(
      "UPDATE Users SET money = money - ? WHERE id = ?",
      [amount, userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export async function addStickerToInventory(
  userId: string,
  stickerId: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    database.run(
      "INSERT INTO Inventory (user_id, sticker_id) VALUES (?, ?)",
      [userId, stickerId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

export async function getUserStickers(userId: string): Promise<UserSticker[]> {
  return new Promise((resolve, reject) => {
    const sql = `
        SELECT 
          Stickers.name, 
          Stickers.source_url as sourceUrl, 
          Stickers.rarity,
          Stickers.stickerDesc
        FROM Stickers
        JOIN Inventory ON Stickers.id = Inventory.sticker_id
        WHERE Inventory.user_id = ?`;

    database.all(sql, [userId], (err, rows: UserSticker[]) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

export async function getUserStats(userId: string): Promise<{
  money: number;
}> {
  return new Promise((resolve, reject) => {
    const sql = `
        SELECT 
          u.money, 
        FROM Users u
        LEFT JOIN Inventory i ON u.id = i.user_id
        WHERE u.id = ?
        GROUP BY u.id`;

    database.get(sql, [userId], (err, row) => {
      if (err) reject(err);
      else resolve(row as unknown as { money: number; stickerCount: number });
    });
  });
}

export async function insertSticker(sticker: {
  stickerName: string;
  stickerDescription: string;
  sourceUrl: string;
  rarity: number;
}): Promise<number> {
  return new Promise((resolve, reject) => {
    const sql = `INSERT INTO Stickers (name, source_url, rarity, stickerDesc) VALUES (?, ?, ?, ?)`;
    database.run(
      sql,
      [
        sticker.stickerName,
        sticker.sourceUrl,
        sticker.rarity,
        sticker.stickerDescription,
      ],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

const stickers = [
  {
    stickerName: "BUNEARY_1.png",
    stickerDescription:
      "A cheerful and bouncy rabbit Pokémon that thrives in grassy fields.",
    sourceUrl: "/pkmn/BUNEARY_1.png",
    rarity: 1,
  },
  {
    stickerName: "CASTFORM_4.png",
    stickerDescription:
      "A weather-shifting Pokémon that adapts to its surroundings with different forms.",
    sourceUrl: "/pkmn/CASTFORM_4.png",
    rarity: 1,
  },
  {
    stickerName: "CHARGOO.png",
    stickerDescription:
      "This tiny spark bug stores electricity in its shell and zips around when excited.",
    sourceUrl: "/pkmn/CHARGOO.png",
    rarity: 1,
  },
  {
    stickerName: "NOCTOWL_100.png",
    stickerDescription:
      "An older, wise owl Pokémon known for its silent flight and deep gaze.",
    sourceUrl: "/pkmn/NOCTOWL_100.png",
    rarity: 1,
  },
  {
    stickerName: "FALINKS_1.png",
    stickerDescription:
      "A coordinated team of tiny fighters that move as one unified force.",
    sourceUrl: "/pkmn/FALINKS_1.png",
    rarity: 2,
  },
  {
    stickerName: "PLATERIGUS.png",
    stickerDescription:
      "A mysterious steel-plated Pokémon with runic engravings across its armor.",
    sourceUrl: "/pkmn/PLATERIGUS.png",
    rarity: 2,
  },
  {
    stickerName: "MORTARINE.png",
    stickerDescription:
      "An ominous fire-type Pokémon resembling a furnace, known to haunt old factories.",
    sourceUrl: "/pkmn/MORTARINE.png",
    rarity: 3,
  },
  {
    stickerName: "GLYPTOBLOCK.png",
    stickerDescription:
      "A relic Pokémon made of ancient stone blocks, it guards sacred ruins.",
    sourceUrl: "/pkmn/GLYPTOBLOCK.png",
    rarity: 3,
  },
  {
    stickerName: "SUFFERUB.png",
    stickerDescription:
      "A tragic, cursed Pokémon that emits sorrowful cries in the night.",
    sourceUrl: "/pkmn/SUFFERUB.png",
    rarity: 4,
  },
  {
    stickerName: "TRAUMATISSE.png",
    stickerDescription:
      "A legendary fairy-ghost Pokémon that appears in nightmares to test courage.",
    sourceUrl: "/pkmn/TRAUMATISSE.png",
    rarity: 4,
  },
];

export async function purchaseChest(
  userId: string,
  chestPrice: number,
  chestRarity: number
): Promise<{
  name: string;
  sourceUrl: string;
  rarity: number;
  stickerDesc: string;
}> {
  const user = await getUserById(userId);
  if (!user || user.money < chestPrice) {
    throw new Error("Insufficient funds");
  }
  await removeMoney(userId, chestPrice);
  const availableStickers = stickers.filter((s) => s.rarity === chestRarity);
  const randomSticker =
    availableStickers[Math.floor(Math.random() * availableStickers.length)];
  const stickerId = await insertSticker(randomSticker);
  await addStickerToInventory(userId, stickerId);
  return {
    name: randomSticker.stickerName,
    sourceUrl: randomSticker.sourceUrl,
    rarity: randomSticker.rarity,
    stickerDesc: randomSticker.stickerDescription,
  };
}

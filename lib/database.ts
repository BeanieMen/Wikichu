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
      rarity INTEGER CHECK (rarity >= 1 AND rarity <= 5),
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

export async function addUser(id: string, money = 0, xp = 0): Promise<void> {
  return new Promise((resolve, reject) => {
    database.run(
      "INSERT OR IGNORE INTO Users (id, money, xp) VALUES (?, ?, ?)",
      [id, money, xp],
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

export async function addXp(userId: string, xpAmount: number): Promise<void> {
  return new Promise((resolve, reject) => {
    database.run(
      "UPDATE Users SET xp = xp + ? WHERE id = ?",
      [xpAmount, userId],
      (err) => {
        if (err) reject(err);
        else resolve();
      }
    );
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

// 📊 Get combined user stats for profile view
export async function getUserStats(userId: string): Promise<{
  money: number;
  xp: number;
  stickerCount: number;
}> {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        u.money, 
        u.xp, 
        COUNT(i.id) as stickerCount
      FROM Users u
      LEFT JOIN Inventory i ON u.id = i.user_id
      WHERE u.id = ?
      GROUP BY u.id`;

    database.get(sql, [userId], (err, row) => {
      if (err) reject(err);
      else
        resolve(
          row as unknown as { money: number; xp: number; stickerCount: number }
        );
    });
  });
}

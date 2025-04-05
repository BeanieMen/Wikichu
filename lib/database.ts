import sqlite3 from "sqlite3";

const database = new sqlite3.Database("main.db");

export function initDatabase() {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS Users (
      id TEXT PRIMARY KEY,
      money INTEGER NOT NULL DEFAULT 0
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
      user_id INTEGER NOT NULL,
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

export async function addUser(money: number): Promise<number> {
  return new Promise((resolve, reject) => {
    database.run(
      "INSERT INTO Users (money) VALUES (?)",
      [money],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      }
    );
  });
}

export async function getUserById(userId: string): Promise<any> {
  return new Promise((resolve, reject) => {
    database.get("SELECT * FROM Users WHERE id = ?", [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
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
        if (err) {
          reject(err);
        } else {
          resolve();
        }
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
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

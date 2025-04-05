import { database } from "@/lib/database";

export async function getLoginStreak(userId: string): Promise<number> {
  return new Promise((resolve, reject) => {
    const query = `
            SELECT DISTINCT strftime('%Y-%m-%d', loginTimestamp, 'utc') as loginDate
            FROM UserLogins
            WHERE userId = ?
            ORDER BY loginDate DESC
        `;

    database.all(query, [userId], (err, rows: { loginDate: string }[]) => {
      if (err) {
        console.error("Error fetching login dates:", err);
        return reject(new Error("Database error fetching streak data."));
      }

      if (!rows || rows.length === 0) {
        return resolve(0);
      }

      let streak = 0;
      const today = new Date();
      const todayDateStr = today.toISOString().split("T")[0]; // YYYY-MM-DD in UTC

      const yesterday = new Date(today);
      yesterday.setUTCDate(today.getUTCDate() - 1);
      const yesterdayDateStr = yesterday.toISOString().split("T")[0];

      const lastLoginDateStr = rows[0].loginDate;

      if (
        lastLoginDateStr === todayDateStr ||
        lastLoginDateStr === yesterdayDateStr
      ) {
        streak = 1;
        let expectedDate = new Date(
          Date.parse(lastLoginDateStr + "T00:00:00Z")
        ); // Parse as UTC

        for (let i = 1; i < rows.length; i++) {
          expectedDate.setUTCDate(expectedDate.getUTCDate() - 1);
          const expectedDateStr = expectedDate.toISOString().split("T")[0];

          if (rows[i].loginDate === expectedDateStr) {
            streak++;
          } else {
            break; // Gap found, streak broken
          }
        }
      } else {
        streak = 0;
      }

      resolve(streak);
    });
  });
}

// --- IMPORTANT ---
// You MUST implement logic elsewhere (e.g., middleware, webhook handler)
// to INSERT a record into the `UserLogins` table each time a user signs in via Clerk.
// Example Table Schema (SQLite):
// CREATE TABLE IF NOT EXISTS UserLogins (
//     id INTEGER PRIMARY KEY AUTOINCREMENT,
//     userId TEXT NOT NULL,
//     loginTimestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
//     UNIQUE(userId, DATE(loginTimestamp, 'utc')) -- Optional: Prevent multiple entries per user per day
// );

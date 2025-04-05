import { NextRequest } from "next/server";
import { config } from "dotenv";
import { getUserStickers } from "@/lib/database";

config();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { userId } = body;

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "Missing question or answer" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  const userStickers = await getUserStickers(userId);
  return new Response(JSON.stringify(userStickers), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

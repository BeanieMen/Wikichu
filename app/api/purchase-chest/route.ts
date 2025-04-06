import { NextRequest, NextResponse } from "next/server";
import { purchaseChest } from "@/lib/database";
import { getAuth } from "@clerk/nextjs/server";

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const { chestPrice, chestRarity } = await request.json();
  try {
    const sticker = await purchaseChest(userId, chestPrice, chestRarity);
    return NextResponse.json({ sticker });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

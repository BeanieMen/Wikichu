import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getUserById } from "@/lib/database";

export async function GET(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userData = await getUserById(userId);
    const coins = userData?.money ?? 0;

    return NextResponse.json(coins);
  } catch (error) {
    console.error("Error fetching user stats:", error);
    // Avoid leaking internal error details
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
}

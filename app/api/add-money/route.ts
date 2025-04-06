import { NextResponse } from 'next/server';
import { addMoney } from '@/lib/database';

export async function POST(request: Request) {
  const { userId, amount } = await request.json();
  try {
    await addMoney(userId, amount);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.error();
  }
}

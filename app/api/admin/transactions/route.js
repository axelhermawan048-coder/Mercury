import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Transaction } from '@/models/schema';

export async function GET() {
  try {
    await connectDB();
    const trxs = await Transaction.find().sort({ createdAt: -1 });
    return NextResponse.json(trxs);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
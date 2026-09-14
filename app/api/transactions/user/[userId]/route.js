import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Transaction } from '@/models/schema';

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { userId } = params;
    
    const history = await Transaction.find({ userId }).sort({ createdAt: -1 });
    return NextResponse.json({ transactions: history }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
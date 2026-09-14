import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/schema';

export async function GET() {
  try {
    await connectDB();
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
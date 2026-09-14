import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/schema';

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    
    const user = await User.findOne({ email, password });
    if (!user) {
      return NextResponse.json({ message: 'Email atau kata sandi salah' }, { status: 401 });
    }

    const userResponse = user.toObject();
    delete userResponse.password;

    return NextResponse.json({ message: 'Login berhasil', user: userResponse });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
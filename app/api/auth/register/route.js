import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/schema';

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Semua field harus diisi!' }, { status: 400 });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ message: 'Email sudah terdaftar!' }, { status: 400 });
    }

    // Membuat ID unik untuk user
    const userId = '#USR-' + Math.floor(1000 + Math.random() * 9000);
    const user = await User.create({ userId, name, email, password, balance: 0 });
    
    const userResponse = user.toObject();
    delete userResponse.password; // Sembunyikan password dari respons

    return NextResponse.json({ message: 'Registrasi berhasil', user: userResponse }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
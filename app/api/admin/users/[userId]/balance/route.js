import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/schema';
import mongoose from 'mongoose';

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { balance } = await req.json();
    if (balance < 0) return NextResponse.json({ message: 'Saldo tidak boleh negatif' }, { status: 400 });

    const param = params.userId;
    const query = param.startsWith('#USR-') ? { userId: param } : mongoose.Types.ObjectId.isValid(param) ? { _id: param } : null;

    if (!query) return NextResponse.json({ message: 'Format ID tidak valid' }, { status: 400 });

    const user = await User.findOneAndUpdate(
      query,
      { balance },
      { new: true }
    ).select('-password');
    return NextResponse.json(user);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User, Transaction } from '@/models/schema';
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    await connectDB();
    const { userId, userName, type, amount, bankDetails } = await req.json();
    
    if (amount <= 0) {
      return NextResponse.json({ message: 'Jumlah transaksi harus lebih dari 0' }, { status: 400 });
    }

    if (type === 'Withdraw') {
      const query = userId.startsWith('#USR-') ? { userId } : mongoose.Types.ObjectId.isValid(userId) ? { _id: userId } : null;
      if (!query) return NextResponse.json({ message: 'Format ID tidak valid' }, { status: 400 });

      const user = await User.findOne(query);
      if (!user) return NextResponse.json({ message: 'User tidak ditemukan' }, { status: 404 });
      if (user.balance < amount) {
        return NextResponse.json({ message: 'Saldo tidak mencukupi untuk penarikan' }, { status: 400 });
      }
    }

    const trxId = '#' + (type === 'Deposit' ? 'DEP-' : 'WD-') + Math.floor(10000 + Math.random() * 90000);
    
    const newTrx = await Transaction.create({
      trxId, userId, userName, type, amount, bankDetails
    });

    return NextResponse.json(newTrx, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User, Transaction } from '@/models/schema';
import mongoose from 'mongoose';

export async function PUT(req, { params }) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectDB();
    const { status } = await req.json();
    const trx = await Transaction.findOne({ trxId: params.trxId }).session(session);
    
    if (!trx) {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: 'Transaksi tidak ditemukan' }, { status: 404 });
    }

    if (trx.status === 'Berhasil' || trx.status === 'Ditolak') {
      await session.abortTransaction();
      session.endSession();
      return NextResponse.json({ message: `Transaksi sudah berstatus ${trx.status}` }, { status: 400 });
    }

    if (status === 'Berhasil') {
      const userQuery = trx.userId.startsWith('#USR-') ? { userId: trx.userId } : mongoose.Types.ObjectId.isValid(trx.userId) ? { _id: trx.userId } : null;
      const user = await User.findOne(userQuery).session(session);
      if (!user) {
        await session.abortTransaction();
        session.endSession();
        return NextResponse.json({ message: 'User transaksi tidak ditemukan' }, { status: 404 });
      }

      if (trx.type === 'Deposit') {
        user.balance += trx.amount;
      } else if (trx.type === 'Withdraw') {
        if (user.balance < trx.amount) {
          await session.abortTransaction();
          session.endSession();
          return NextResponse.json({ message: 'Gagal konfirmasi: Saldo user kurang dari jumlah penarikan' }, { status: 400 });
        }
        user.balance -= trx.amount;
      }
      await user.save({ session });
    }

    trx.status = status;
    await trx.save({ session });

    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(trx);
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
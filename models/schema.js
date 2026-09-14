import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  balance: { type: Number, default: 0, min: 0 },
  kycStatus: { type: String, default: 'Belum Verifikasi' },
  bankInfo: {
    bankName: { type: String, default: '' },
    accNumber: { type: String, default: '' },
    holderName: { type: String, default: '' }
  }
}, { timestamps: true });

const transactionSchema = new mongoose.Schema({
  trxId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  type: { type: String, enum: ['Deposit', 'Withdraw'], required: true },
  amount: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['Pending', 'Berhasil', 'Ditolak'], default: 'Pending' },
  bankDetails: String
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
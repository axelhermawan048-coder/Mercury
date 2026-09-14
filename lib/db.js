import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://axelhermawan048_db_user:3czqMIAtdVIKAmQS@cluster0.qc7vcmo.mongodb.net/?appName=Cluster0";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  try {
    const db = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      bufferCommands: false
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('MongoDB Atlas Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    throw err;
  }
};
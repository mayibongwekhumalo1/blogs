import mongoose, { Connection } from "mongoose";
declare global {
  var mongoose: {
    conn: Connection | null;
    promise: Promise<unknown> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env");
}

const cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI);
  }
  await cached.promise;
  cached.conn = mongoose.connection;
  return cached.conn;
}

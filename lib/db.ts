import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
type Cache = { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
const globalForMongoose = global as typeof globalThis & { mongooseCache?: Cache };
const cache = globalForMongoose.mongooseCache ?? { conn: null, promise: null };
globalForMongoose.mongooseCache = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn;
  if (!MONGODB_URI) throw new Error("MONGODB_URI is not configured");
  cache.promise ??= mongoose.connect(MONGODB_URI, { bufferCommands: false, serverSelectionTimeoutMS: 8000 });
  cache.conn = await cache.promise;
  return cache.conn;
}

import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || ''

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Please configure a remote MongoDB connection (for production use MongoDB Atlas) in your hosting provider environment variables.')
  }

  // Defensive: if the URI points at localhost, fail early with a clearer message
  const low = MONGODB_URI.toLowerCase()
  if (low.includes('localhost') || low.includes('127.0.0.1') || low.includes('::1')) {
    throw new Error('MONGODB_URI appears to point to localhost (127.0.0.1). A deployed server (Vercel) cannot reach your local MongoDB. Use a remote MongoDB (Atlas) and set MONGODB_URI accordingly.')
  }

  if (cached.conn) {
    return cached.conn
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false
    }
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

export default dbConnect

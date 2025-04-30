import mongoose from 'mongoose';

// Define the interface for the global mongoose cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare mongoose property on global object
declare global {
  var mongoose: MongooseCache | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI as string;

// Create a function that returns a real or mock connection based on environment
async function dbConnect() {
  // TEMPORARY FIX: Create mock connection if MONGODB_URI is not defined
  if (!MONGODB_URI) {
    console.error('MONGODB_URI not defined in environment variables. Please set up your .env.local file with a valid MongoDB connection string.');
    throw new Error('MongoDB connection string (MONGODB_URI) is not defined. Please set this in your .env.local file.');
  } 
  
  // Regular MongoDB connection
  let cached = global.mongoose || { conn: null, promise: null };
  
  // Set the mongoose cache on the global object
  global.mongoose = cached;
  
  if (cached.conn) {
    return cached.conn;
  }
  
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };
    
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Connected to MongoDB Atlas!');
      // Log information about the database
      const connectionState = mongoose.connection.readyState;
      const stateMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
      };
      console.log(`MongoDB connection state: ${stateMap[connectionState as 0 | 1 | 2 | 3]}`);
      console.log(`MongoDB host: ${mongoose.connection.host}`);
      console.log(`MongoDB database name: ${mongoose.connection.name}`);
      
      return mongoose;
    }).catch(err => {
      console.error('MongoDB connection error:', err);
      throw err;
    });
  }
  
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

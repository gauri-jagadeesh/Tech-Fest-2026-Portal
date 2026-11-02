import mongoose from 'mongoose';
import { seedData } from '../utils/seed.js';

let mongodInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri && uri !== 'your_mongodb_atlas_connection_string') {
    try {
      console.log('🔄 Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log(`\n✅ MongoDB Atlas Connected: ${conn.connection.host} [Database: ${conn.connection.name}]\n`);
      return true;
    } catch (error) {
      console.error(`\n❌ MongoDB Atlas Connection Error: ${error.message}`);
      if (process.env.NODE_ENV === 'production') {
        console.error('Fatal: Production environment requires a valid MongoDB Atlas connection.');
        throw error;
      }
      console.warn('\n⚠️  Notice: Atlas authentication or network failed for local development.');
      console.warn('   Credentials in server/.env resulted in: ' + error.message);
      console.warn('   1. Verify your user in MongoDB Atlas -> Security -> Database Access');
      console.warn('   2. Verify IP whitelist in MongoDB Atlas -> Security -> Network Access (0.0.0.0/0)');
      console.warn('⚡ Initializing local development MongoMemoryServer fallback to keep local dev unblocked...\n');
    }
  }

  // Fallback for local development
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    await mongoose.connect(memoryUri);
    console.log(`✅ Local MongoMemoryServer Connected: ${memoryUri}`);
    console.log('🌱 Pre-seeding database with festival events, student, and admin accounts...');
    await seedData();
    console.log('✨ Local database ready for CRUD, registration, and authentication testing.\n');
    return true;
  } catch (memError) {
    console.error('❌ Failed to initialize local MongoDB fallback:', memError.message);
    return false;
  }
};

export default connectDB;

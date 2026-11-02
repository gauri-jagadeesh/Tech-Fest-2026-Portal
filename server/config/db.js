import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri || uri === 'your_mongodb_atlas_connection_string') {
    console.warn('\n⚠️  [MONGODB WARNING] MONGO_URI is not set in server/.env');
    console.warn('👉 Please configure your MongoDB Atlas connection string in server/.env:');
    console.warn('   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/techfest2026?retryWrites=true&w=majority');
    console.warn('👉 Remember to whitelist your IP or allow access from anywhere (0.0.0.0/0) in Atlas Network Access.\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`\n✅ MongoDB Atlas Connected: ${conn.connection.host} [Database: ${conn.connection.name}]`);
    return true;
  } catch (error) {
    console.error(`\n❌ MongoDB Connection Error: ${error.message}`);
    console.warn('👉 Check your MongoDB Atlas credentials, database user permissions, and Network Access whitelist (IP access list).\n');
    return false;
  }
};

export default connectDB;

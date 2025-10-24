import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI is not defined in environment variables');

    // Use the `dbName` option instead of string-concatenating the path. This
    // prevents accidental double-slashes in the connection string which lead
    // to invalid namespaces like "/chatApp.users".
    await mongoose.connect(uri, { dbName: 'chatApp' });
    console.log("✅ Database Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:", error.message);
  }
};

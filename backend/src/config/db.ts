import mongoose from "mongoose";

const dbConnect = async (): Promise<boolean> => {
  try {
    const db_uri = process.env.MONGO_URI;
    if (!db_uri) {
      throw new Error("DB_URI not found in environment variables");
    }

    await mongoose.connect(db_uri);
    console.log("✅ DB connection successful");
    return true;
  } catch (error) {
    console.error("❌ DB connection error:", (error as Error).message);
    return false;
  }
};
 
export default dbConnect;

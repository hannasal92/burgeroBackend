import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/intelligenter";

let retryCount = 0;
const MAX_RETRIES = 5;

export async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 5,
      minPoolSize: 2,
      maxIdleTimeMS: 30000,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    retryCount = 0; // ✅ reset retries on success
    console.log("✅ MongoDB connected");

  } catch (err) {
    retryCount++;
    console.error(`❌ MongoDB connection failed (attempt ${retryCount})`, err);

    if (retryCount >= MAX_RETRIES) {
      console.error("🚨 Max MongoDB retries reached. Exiting process.");
      process.exit(1);
    }

    setTimeout(connectDB, 5000);
  }
}

/* ============================
   CONNECTION EVENTS
============================ */

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB runtime error:", err);
});
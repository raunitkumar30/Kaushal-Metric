const mongoose = require("mongoose");

let mongoMemoryServer = null;

const autoSeedDemoData = async () => {
  try {
    const User = require("../models/User");
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("🌱 Database is fresh, initializing clean Maharashtra SIH demo accounts...");
      const { clearOperationalData } = require("../controllers/demoController");
      await clearOperationalData();
      console.log("✅ Initialized clean Maharashtra demo accounts successfully!");
    }
  } catch (seedErr) {
    console.warn("⚠️ Demo auto-seed notice:", seedErr.message);
  }
};

const connectDatabase = async () => {
  const targetUri = process.env.MONGODB_URI || "mongodb://localhost:27017/skillimpact";
  try {
    await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log("✅ MongoDB connected successfully to:", targetUri);
    await autoSeedDemoData();
  } catch (error) {
    console.warn("⚠️  Primary MongoDB not reachable (" + error.message + ").");
    console.log("🚀  Starting in-memory MongoDB server (MongoMemoryServer)...");
    try {
      const { MongoMemoryServer } = require("mongodb-memory-server");
      mongoMemoryServer = await MongoMemoryServer.create();
      const memUri = mongoMemoryServer.getUri();
      console.log("✅ In-memory MongoDB running at:", memUri);

      await mongoose.connect(memUri);
      console.log("✅ Mongoose connected to in-memory MongoDB!");
      await autoSeedDemoData();
    } catch (memError) {
      console.error("❌ Failed to start in-memory MongoDB:", memError.message);
      console.warn("👉 Please ensure MongoDB is running at " + targetUri + " or update MONGODB_URI in server/.env");
    }
  }
};

module.exports = connectDatabase;

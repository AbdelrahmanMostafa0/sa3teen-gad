import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
  if (!MONGODB_URI) {
    throw new Error(
      "Please define the MONGODB_URI environment variable inside .env.local"
    );
  } else {
    const connectionState = mongoose.connection.readyState;
    if (connectionState === 1) {
      console.log("MongoDB is already connected.");
      return;
    }
    if (connectionState === 2) {
      console.log("MongoDB connection is in progress.");
      return;
    }
    try {
      await mongoose.connect(MONGODB_URI, {
        dbName: "sa3teen-gad",
        bufferCommands: true,
      });
      console.log("MongoDB connected successfully.");
    } catch (error) {
      console.error("MongoDB connection error:", error);
      throw error;
    }
  }
};

export default connect;

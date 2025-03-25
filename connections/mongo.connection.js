import mongoose from "mongoose";

const CONNECTION_URI=process.env.MONGO_URI || "mongodb://localhost:27017/POS"
export const mongoConnect = async () => {
  try {
    await mongoose.connect(CONNECTION_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    throw new Error(err);
  }
};

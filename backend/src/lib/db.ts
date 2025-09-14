import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const URI = process.env.MONGO_URL;

export const ConnectDB = async () => {
  try {
    if (!URI) {
      console.log("URI not found");
      return;
    }
    await mongoose.connect(URI);
    console.log("connected to db");
  } catch (error) {
    console.log(error);
    process.exit(1); //1 means fail 0 means pass
  }
};

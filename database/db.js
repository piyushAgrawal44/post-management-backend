import mongoose from "mongoose";

export const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    
    console.log("db is connected");
  } catch (error) {
    console.log("db is not connected",error.message);
  }
};

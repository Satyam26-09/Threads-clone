import mongoose from "mongoose";

const connectToDB = async () => {
  let isConnected = false;
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) return console.log("MongoDB URL not found");
  if (isConnected) return console.log("Already Connected to MongoDB");

  try {
    await mongoose.connect(process.env.MONGODB_URL, { dbName: "Threads" });

    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};
export default connectToDB;

import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const uri: string = process.env.MONGO_URI || "";
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri);
  } catch (err) {
    console.log(err);
  }
};

export default dbConnect;

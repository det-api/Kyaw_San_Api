import mongoose from "mongoose";
import config from "config";

const dbConnect = async () => {
  const dbUrl = config.get<string>("dbUrl");

  try {
    console.log(dbUrl);
    await mongoose.connect(dbUrl);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
    console.log("Could not connect to DB");
    process.exit(1);
  }
};

export default dbConnect;

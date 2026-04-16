import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MongoDBURI);

const admin = await mongoose.connection.db
  .collection("admin")
  .find({})
  .toArray();

console.log("Saare admin:", JSON.stringify(admin, null, 2));

mongoose.disconnect();
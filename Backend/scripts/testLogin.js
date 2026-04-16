import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MongoDBURI);

const { default: Admin } = await import("../model/admin.model.js");

const admin = await Admin.findOne({ email: "akshayrajput81266@gmail.com" });

if (!admin) {
  console.log(" Admin nahi mila DB mein");
} else {
  console.log(" Admin mila:", admin.email);
  console.log("Stored hash:", admin.password);

  const isMatch = await bcrypt.compare("Akshay@81266", admin.password);
  console.log("Password match:", isMatch ? " YES" : " NO");
}

mongoose.disconnect();
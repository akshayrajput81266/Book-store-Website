import mongoose from "mongoose";
import Admin from "../model/admin.model.js";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MongoDBURI);

await Admin.create({
  name: "Admin",
  email: "admin@bookstore.com",
  password: "apna_password_yahan",
});

console.log(" Admin ban gaya!");
mongoose.disconnect();
// scripts/resetAdminPassword.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

await mongoose.connect(process.env.MongoDBURI);

const newPassword = "Akshay@81266";
const hashed = await bcrypt.hash(newPassword, 10);

console.log("Saving hash:", hashed);

await mongoose.connection.db.collection("admin").updateMany(
  {},
  { $set: { password: hashed } }
);


const admins = await mongoose.connection.db.collection("admin").find({}).toArray();
admins.forEach(a => console.log(a.email, "=>", a.password));

mongoose.disconnect();
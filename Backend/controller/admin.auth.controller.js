// controller/admin.auth.controller.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const adminLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await mongoose.connection.db
      .collection("admin")
      .findOne({ email });

    console.log("Admin found:", admin ? " YES" : "NO");
    console.log("Entered password:", password);
    console.log("DB hash:", admin?.password);

    if (!admin)
      return res.status(401).json({ message: "Email ya password galat hai" });

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log("Password match:", isMatch ? " YES" : "NO");

    if (!isMatch)
      return res.status(401).json({ message: "Email ya password galat hai" });

    const token = jwt.sign(
      { id: admin._id, name: admin.name },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, admin: { name: admin.name, email: admin.email } });
  } catch (err) {
    console.log("Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
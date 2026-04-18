import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bookRoute from "./route/book.route.js";
import userRoute from "./route/user.route.js";
import orderRoute from "./route/order.route.js";
import contactRoute from "./route/contact.route.js";
import aiRoute from "./route/ai.route.js";
import adminAuthRoute from "./route/admin.auth.route.js";

dotenv.config();
const app = express();

// ✅ CORS fix - multiple origins
const allowedOrigins = [
  "https://singh-book-store-website.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000"
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

const port = process.env.PORT || 4001;
const URI = process.env.MONGODBURI;

try {
  await mongoose.connect(URI);
  console.log("Connected to mongoDB");
} catch(error) {
  console.log("Error: ", error);
}

// Routes
app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/api/orders", orderRoute);
app.use("/api/contact", contactRoute);
app.use("/api/ai", aiRoute);
app.use("/api/admin", adminAuthRoute);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

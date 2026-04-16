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
const app = express()

app.use(cors());
app.use(express.json());

const port = process.env.Port || 4000;
const URI = process.env.MongoDBURI;

try {
  await mongoose.connect(URI);
  console.log("Connected to mongoDB");
} catch(error) {
  console.log("Error: ", error);
}

// defining routes
app.use("/book", bookRoute);
app.use("/user", userRoute);
app.use("/api/orders", orderRoute);
app.use("/api/contact", contactRoute);
app.use("/api/ai", aiRoute);
app.use("/api/admin", adminAuthRoute); 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

const allowedOrigins = [
  "https://twitter-app-client-live.vercel.app",
  "http://localhost:5173",
];

const app = express();
const PORT = process.env.PORT || 5000;

// connectMongoDB()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server is running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("Failed to connect to MongoDB:", err);
//   });

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, //Connection b/w frontend and backend, Allows cookies & authentication headers
  })
);

app.use(express.json({ limit: "5mb" })); //keeping limit small to avoid DOS attack
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cloudinary Configuration Check
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("Cloudinary environment variables are missing!");
  process.exit(1);
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connecting to MongoDB before starting the server
connectMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

// Global Error Handler at the End
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// app.listen(PORT, () => {
//   console.log(`Server is up and running on port ${PORT}`);
//   connectMongoDB();
// });

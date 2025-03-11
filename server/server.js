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

const app = express();
const PORT = process.env.PORT || 5000;

//Improved CORS Configuration
const allowedOrigins = [
  "https://twitter-app-client-live.vercel.app", // Deployed frontend
  "http://localhost:5173", // Local development
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow cookies
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], // Allow JWT token
  })
);

//Express Middleware
app.use(express.json({ limit: "5mb" })); // Prevent large request attacks
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//Cloudinary Configuration Handling
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.warn("WARNING: Cloudinary environment variables are missing!");
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

//Connecting to MongoDB before starting the server
connectMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err, req, res, next) => {
  console.error(" Server Error:", err.message);
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.message || "Internal Server Error",
  });
});

// backend/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import collabRoutes from "./routes/collabRoutes.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);       // ✅ Now Express knows this route
app.use("/api/streak", streakRoutes);
app.use("/api/collabs", collabRoutes);

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to DailyDevHub API!");
});

// Error handling middleware
app.use(errorHandler);

export default app;

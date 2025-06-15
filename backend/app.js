import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import collabRoutes from "./routes/collabRoutes.js";
import userRoutes from "./routes/userRoutes.js"; // new import
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// ✅ Allow CORS for both local and deployed frontend
const allowedOrigins = [
  'http://localhost:3000',
  'https://dailydevhub-codeconquer.vercel.app'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/collabs", collabRoutes);
app.use("/api/users", userRoutes);   // new user routes

// Home route
app.get("/", (req, res) => {
  res.send("Welcome to DailyDevHub API!");
});

// Error handling middleware
app.use(errorHandler);

export default app;

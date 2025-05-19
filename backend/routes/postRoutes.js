// backend/routes/postRoutes.js

import express from "express";
import multer from "multer";
import { createPost, getPosts } from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

// Setup Multer for image uploads (stores in memory as buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

// Route to create a post with an image upload
router.post("/", authMiddleware, upload.single("image"), createPost);

// Route to fetch posts
router.get("/", authMiddleware, getPosts);

export default router;

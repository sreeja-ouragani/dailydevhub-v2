import express from "express";
import { searchUsers, getUserById } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected route to search users
router.get("/search", authMiddleware, searchUsers);

// Protected route to get full user profile by ID
router.get("/:id", authMiddleware, getUserById);

export default router;

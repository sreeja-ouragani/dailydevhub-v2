import express from "express";
import { searchUsers } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Protected route to search users
router.get("/search", authMiddleware, searchUsers);

export default router;

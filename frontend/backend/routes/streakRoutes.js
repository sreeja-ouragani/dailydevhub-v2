import express from "express";
import { getUserStreak, updateUserStreak } from "../controllers/streakController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getUserStreak);
router.post("/update", authMiddleware, updateUserStreak);

export default router;

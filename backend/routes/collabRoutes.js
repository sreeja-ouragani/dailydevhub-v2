import express from "express";
import {
  sendCollabRequest,
  getReceivedCollabs,
  respondCollabRequest,
} from "../controllers/collabController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, sendCollabRequest);
router.get("/received", authMiddleware, getReceivedCollabs);
router.patch("/:id/respond", authMiddleware, respondCollabRequest);

export default router;

import express from "express";
import {
  sendCollabRequest,
  getReceivedCollabs,
  respondCollabRequest,
  getSentCollabs,        // ✅ NEW
  getOngoingCollabs      // ✅ NEW
} from "../controllers/collabController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, sendCollabRequest);
router.get("/received", authMiddleware, getReceivedCollabs);
router.get("/sent", authMiddleware, getSentCollabs);         // ✅ NEW
router.get("/ongoing", authMiddleware, getOngoingCollabs);   // ✅ NEW
router.patch("/:id/respond", authMiddleware, respondCollabRequest);

export default router;

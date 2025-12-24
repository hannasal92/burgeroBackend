import express from "express";
import { authenticateToken } from "../middlewares/authenticateToken";
import { getPlaceStatus, togglePlace } from "../controllers/toggleController";

const router = express.Router();

router.get("/status", authenticateToken, getPlaceStatus);
router.post("/toggle", authenticateToken, togglePlace);

export default router;

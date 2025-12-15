import express from "express";
import { getOrders } from "../controllers/orderController";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = express.Router();

router.get("/userOrders", authenticateToken, getOrders);

export default router;
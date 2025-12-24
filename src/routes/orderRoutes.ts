import express from "express";
import { getOrders, getAllOrders, getNewOrders, updateOrderStatus } from "../controllers/orderController";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = express.Router();

router.get("/userOrders", authenticateToken, getOrders);
router.get("/allOrders", authenticateToken, getAllOrders);
router.get("/newOrders", authenticateToken, getNewOrders);
router.patch("/:orderId/status", authenticateToken, updateOrderStatus);

export default router;
import express from "express";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";
import paymentRoutes from "./paymentRoutes";

const router = express.Router();

router.use("/api/auth", userRoutes);
router.use("/api/product", productRoutes);
router.use("/api/payment", paymentRoutes);

export default router;
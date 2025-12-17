import express from "express";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";
import paymentRoutes from "./paymentRoutes";
import orderRoutes from "./orderRoutes";
import boookTableRoutes from "./bookTableRoutes";

const router = express.Router();

router.use("/api/auth", userRoutes);
router.use("/api/product", productRoutes);
router.use("/api/payment", paymentRoutes);
router.use("/api/order", orderRoutes);
router.use("/api/book", boookTableRoutes);

export default router;
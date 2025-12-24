import express from "express";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";
import paymentRoutes from "./paymentRoutes";
import orderRoutes from "./orderRoutes";
import boookTableRoutes from "./bookTableRoutes";
import ToggleRoutes from "./toggleRoutes";

const router = express.Router();

router.use("/api/auth", userRoutes);
router.use("/api/product", productRoutes);
router.use("/api/payment", paymentRoutes);
router.use("/api/order", orderRoutes);
router.use("/api/tables", boookTableRoutes);
router.use("/api/place", ToggleRoutes);

export default router;
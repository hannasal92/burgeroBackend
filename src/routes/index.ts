import express from "express";
import userRoutes from "./userRoutes";
import productRoutes from "./productRoutes";

const router = express.Router();

router.use("/api/auth", userRoutes);
router.use("/api/product", productRoutes);

export default router;
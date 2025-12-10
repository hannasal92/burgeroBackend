import express from "express";
import userRoutes from "./userRoutes";
// import contactRoutes from "./contactRoutes";
// import dashboardRoutes from "./dashboardRoutes";
// import productsRoutes from './products';
const router = express.Router();

router.use("/api/auth", userRoutes);
// router.use("/api", contactRoutes);
// router.use("/api", dashboardRoutes);
// router.use("/api", productsRoutes);

export default router;
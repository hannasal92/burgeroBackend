import express from "express";
import { submitPayment } from "../controllers/paymentController";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = express.Router();

router.post("/pay", authenticateToken, submitPayment);

export default router;

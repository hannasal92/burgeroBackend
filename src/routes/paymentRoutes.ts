import express from "express";
import { submitPayment, mockInsertOrder } from "../controllers/paymentController";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = express.Router();

router.post("/pay", authenticateToken, submitPayment);
router.post("/insertOrder", mockInsertOrder);

export default router;

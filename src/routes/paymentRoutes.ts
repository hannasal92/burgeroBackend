import express from "express";
import { submitPayment, mockInsertOrder } from "../controllers/paymentController";
import { authenticateToken } from "../middlewares/authenticateToken";
import { openPlace } from "../middlewares/openPlace";

const router = express.Router();

router.post("/pay", authenticateToken, openPlace, submitPayment);
router.post("/insertOrder", mockInsertOrder);

export default router;

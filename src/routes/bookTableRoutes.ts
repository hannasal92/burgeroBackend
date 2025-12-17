import express from "express";
import { bookTable } from "../controllers/bookTableController";
import { authenticateToken } from "../middlewares/authenticateToken";

const router = express.Router();

router.post("/bookTable", authenticateToken, bookTable);

export default router;
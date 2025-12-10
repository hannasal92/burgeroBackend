import express from "express";
import { addUser, loginUser, refreshToken } from "../controllers/userController";

const router = express.Router();

router.post("/signup", addUser);
router.post("/login", loginUser);
router.post("/refreshToken", refreshToken);

export default router;
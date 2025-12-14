import express from "express";
import { addUser, loginUser } from "../controllers/userController";
import { refreshToken } from "../controllers/refreshToken";

const router = express.Router();

router.post("/signup", addUser);
router.post("/login", loginUser);
router.post("/refreshToken", refreshToken);

export default router;
import express from "express";
import { addUser, loginUser, adminLoginUser } from "../controllers/userController";
import { refreshToken } from "../controllers/refreshToken";

const router = express.Router();

router.post("/signup", addUser);
router.post("/login", loginUser);
router.post("/adminLogin", adminLoginUser);
router.post("/refreshToken", refreshToken);

export default router;
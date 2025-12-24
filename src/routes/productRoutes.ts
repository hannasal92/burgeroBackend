import express from "express";
import { addProduct, getProduct } from "../controllers/productController";

const router = express.Router();

router.post("/addProduct", addProduct);
router.get("/getProduct", getProduct);

export default router;

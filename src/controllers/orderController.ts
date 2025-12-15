import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OrderModel } from "../models/Order"; // adjust path if needed

export const getOrders = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // 1️⃣ Verify token
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { id: string };

    const userId = payload.id;

    // 2️⃣ Get user's orders
    const orders = await OrderModel.find({ userId })
      .sort({ createdAt: -1 }) // newest first
      .lean();

    // 3️⃣ Return orders
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Failed to get orders" });
  }
};
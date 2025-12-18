// controllers/orderController.ts (Express)
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OrderModel } from "../models/Order";
import { sendEmail } from "../services/emailService";

export const getOrders = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      role: any; id: string 
    };
    const userId = payload.id;
    const role = payload.role
    // Get page & limit from query
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;
    const query = role === "admin" ? {} : { userId };

    const totalOrders = await OrderModel.countDocuments({ userId });
    const orders = await OrderModel.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({ path: "userId", select: "name phone" }) // ✅ populate name and phone
      .lean();

    const totalPages = Math.ceil(totalOrders / limit);
      const ordersWithUserInfo = orders.map((order: any) => ({
        ...order,
        userName: (order.userId as any).name,
        userPhone: (order.userId as any).phone,
        userId: (order.userId as any)._id,
      }));
    return res.status(200).json({ orders: ordersWithUserInfo, totalPages });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Failed to get orders" });
  }
};
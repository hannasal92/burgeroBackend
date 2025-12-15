import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OrderModel } from "../models/Order";

// req.body should contain { cart, total, paymentType }
export const submitPayment = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    // Verify token and get user ID
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: string };

    const userId = payload.id;

    const { cart, total, paymentType } = req.body;

    if (!cart || !total || !paymentType) {
      return res.status(400).json({ message: "Cart, total or paymentType missing" });
    }

    // Map cart items to Order schema
    const items = cart.map((item: any) => ({
      productId: item._id,
      name: item.name,
      imageUrl: item.image,
      price: item.price,
      quantity: item.quantity,
      selectedAdditions: item.selectedAdditions || [],
      totalPrice: item.totalPrice,
      note: item.note || "",
    }));

    // Create new order
    const newOrder = new OrderModel({
      userId,
      items,
      paymentType,
      total,
      status: "pending",
    });

    await newOrder.save();

    return res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Failed to create order" });
  }
};
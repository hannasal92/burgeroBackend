import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OrderModel } from "../models/Order";
import { UserModel } from "../models/User"; // Import User model
import { sendEmail } from "../services/emailService";
import { getNextOrderNumber } from "../services/orderNumberService";
import mongoose from "mongoose";
import { sendWhatsAppMessage } from "../services/whatsappService";
import { formatPhoneNumber } from "../services/phoneFormatService";

export const submitPayment = async (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    // ✅ Verify token and get user ID
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: string };
    const userId = payload.id;

    // ✅ Fetch user info from DB
    const user = await UserModel.findById(userId).lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const { cart, total, paymentType, delivery } = req.body;
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

     const orderNumber = await getNextOrderNumber();

    // Create new order
    const newOrder = new OrderModel({
      orderNumber,
      delivery,
      userId,
      items,
      paymentType,
      total,
      status: "pending",
    });

    // I have to check the prices also in te backend of the cart
    //#####
    //
    //
    //
    //

    await newOrder.save();
    const textMsg = `${user.name} היי, 
      בורגירו בר קיבל את ההזמנה בהצלחה . 
      סכום ההזמנה: ₪${total}
      תודה שהזמנת אצלנו!
      תקבל/י הודעה נוספת כאשר מצב ההזמנה יתעדכן.`
    const htmlMsg = 
    `
        <p>היי <b>${user.name}</b>,</p>
        <p>בורגירו בר קיבל את ההזמנה בהצלחה.</p>
        <p><b>סכום ההזמנה:</b> ₪${total}<br/>
        <p>תודה שהזמנת אצלנו!</p>
        <p>תקבל/י הודעה נוספת למייל כאשר מצב ההזמנה יתעדכן.</p>
      `
    
    await sendWhatsAppMessage(formatPhoneNumber(user.phone), textMsg);
    // ✅ Send confirmation email
    await sendEmail({
      name: user.name,
      email: user.email,
      subject: "הזמנתך התקבלה בהצלחה ב-Burgero Bar!",
      text: textMsg,
      html: htmlMsg,
    });

    return res.status(201).json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({ message: "Failed to create order" });
  }
};
export const mockInsertOrder = async (req: Request, res: Response) => {
  try {
    const userId = "69434b466f0feb4d4432fabf"; // fallback ID

    const orderNumber = await getNextOrderNumber();

    // Create 1-3 random items
const id = new mongoose.Types.ObjectId();

      const items = [
        {
          productId: id,
          name: "sdsd",
          imageUrl: "123",
          price: 123,
          quantity: 2,
          selectedAdditions: [],
          totalPrice: 0,
          note: "3213dfsa saf",
        },
      ];

    // Calculate totalPrice for each item
    items.forEach((item) => {
      item.totalPrice = item.price * item.quantity;
    });

    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const newOrder = new OrderModel({
      orderNumber,
      userId,
      items,
      paymentType: "cash",
      total,
      status: "pending",
    });

    await newOrder.save();

    return res.status(201).json({ message: "Mock order inserted", order: newOrder });
  } catch (err) {
    console.error("Failed to insert mock order:", err);
    return res.status(500).json({ message: "Failed to insert mock order" });
  }
};
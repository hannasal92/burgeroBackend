// controllers/orderController.ts (Express)
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OrderModel } from "../models/Order";
import { sendEmail } from "../services/emailService";
import { sendWhatsAppMessage } from "../services/whatsappService";
import { formatPhoneNumber } from "../services/phoneFormatService";

export const getOrders = async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: string };
    const userId = payload.id;

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 5;
    const skip = (page - 1) * limit;

    // Find orders for this user only
    const totalOrders = await OrderModel.countDocuments({ userId });
    const orders = await OrderModel.find({ userId })
      .sort({ orderNumber: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalPages = Math.ceil(totalOrders / limit);

    return res.status(200).json({ orders, totalPages });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ message: "Failed to get orders" });
  }
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      role: string;
      id: string;
    };

    if (payload.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    // Fetch all orders, sorted by orderNumber ascending
    const orders = await OrderModel.find()
      .sort({ orderNumber: 1 })
      .populate({ path: "userId", select: "name phone email" })
      .lean();

    // Add userName & userPhone
      const ordersWithUserInfo = orders.map((order: any) => ({
        ...order,
        userName: (order.userId as any).name,
        userPhone: (order.userId as any).phone,
        userEmail: order.userId.email,
        userId: (order.userId as any)._id,
      }));


    return res.status(200).json({ orders: ordersWithUserInfo });
  } catch (error) {
    console.error("Get all orders error:", error);
    return res.status(500).json({ message: "Failed to get all orders" });
  }
};

// ======================
// Get new orders (admin only)
// ======================
export const getNewOrders = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      role: string;
      id: string;
    };

    if (payload.role !== "admin")
      return res.status(403).json({ message: "Access denied" });

    const afterOrderNumber = parseInt(req.query.after as string) || 0;

    // Fetch only orders with orderNumber > afterOrderNumber
    const orders = await OrderModel.find({ orderNumber: { $gt: afterOrderNumber } })
      .sort({ orderNumber: 1 })
      .populate({ path: "userId", select: "name phone email" })
      .lean();

    const ordersWithUserInfo = orders.map((order: any) => ({
      ...order,
      userName: order.userId.name,
      userPhone: order.userId.phone,
      userEmail: order.userId.email,
      userId: order.userId._id,
    }));

    return res.status(200).json({ orders: ordersWithUserInfo });
  } catch (error) {
    console.error("Get new orders error:", error);
    return res.status(500).json({ message: "Failed to get new orders" });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {

    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as {
      role: string;
      id: string;
    };

    if (payload.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    

    const { orderId } = req.params;
    const { status, userData } = req.body; // e.g., "inProcess" or "delivered"
    const {email, phone, name} = userData ;
    const order = await OrderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    ).lean();
    
    if (!order) return res.status(404).json({ message: "Order not found" });
    if( 
      status === "done" 
      && email !== undefined
      && phone !== undefined
      && name !== undefined
    )
    {

      let textMsg = `${name} היי, 
       מצב ההזמנה שלך עודכן ל מוכן תבוא לקחת את ההזמנה שלך`
      let htmlMsg = `
          <p>היי <b></b>,</p>
          <p>מצב ההזמנה שלך עודכן ל מוכן תבוא לקחת את ההזמנה שלך </p>
        `
      if(order?.delivery){
        textMsg = `${name} היי, 
           מצב ההזמנה שלך עודכן ל מוכן השליח בדרכו אליך`
        htmlMsg =`
          <p>היי <b></b>,</p>
          <p>מצב ההזמנה שלך עודכן ל מוכן השליח בדרכו אליך</p>
        `
      }
      // await sendWhatsAppMessage(formatPhoneNumber(phone), textMsg);
    
      // await sendEmail({
      //   name: email,
      //   email: email,
      //   subject: "ההזמנה שלך מוכנה -Burgero Bar!",
      //   text: textMsg,
      //   html: htmlMsg,
      // });
        Promise.allSettled([
        sendEmail({ name: name, email: email, subject: "הזמנת שולחן", text: textMsg, html: htmlMsg }),
        sendWhatsAppMessage(formatPhoneNumber(phone), textMsg)
      ]).then(results => {
        results.forEach(r => r.status === 'rejected' && console.error(r.reason));
      });
    }

    res.status(200).json({ message: "Status updated", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

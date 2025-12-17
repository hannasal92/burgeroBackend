import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TableModel } from "../models/Table";

export const bookTable = async (req: Request, res: Response) => {
  try {
    // 1️⃣ בדיקת token
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 2️⃣ אימות token
    const payload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!
    ) as { id: string };

    // 3️⃣ יצירת הזמנת שולחן
    const booking = await TableModel.create({
      userId: payload.id,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      people: req.body.people,
      date: req.body.date,
      note: req.body.note,
    });

    // 4️⃣ החזרת תשובה
    return res.status(201).json({
      message: "Table booked successfully",
      booking,
    });
  } catch (error) {
    console.error("Book table error:", error);
    return res.status(500).json({ message: "Failed to book table" });
  }
};
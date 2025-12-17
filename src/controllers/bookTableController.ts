import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TableModel } from "../models/Table";
import { sendEmail } from "../services/emailService";

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
    const { name, phone, email, people, date, note } = req.body;

    // 4️⃣ Validate required fields
    if (!name || !phone || !email || !people || !date) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }
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
    const bookingDate = new Date(booking.date);
    const formattedDate = bookingDate.toLocaleDateString("he-IL", {
      weekday: "long",  // e.g., "יום רביעי"
      day: "numeric",
      month: "long",    // e.g., "דצמבר"
      year: "numeric",
    });
    await sendEmail({
      name: name,
      email: email,
      subject: "הזמנת שולחן",
      message: `היי ${booking.name},\n
      בורגירו בר קיבל את הזמנת השולחן שלך. 
      מספר אנשים: ${booking.people} 
      תאריך: ${formattedDate}
      תחכה טלפון לאישור ההזמנה.`,
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
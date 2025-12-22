import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TableModel } from "../models/Table";
import { sendEmail } from "../services/emailService";
import mongoose from "mongoose";
import { getNextReservationNumber } from "../services/reservationNumberService";
import { sendWhatsAppMessage } from "../services/whatsappService";
import { formatPhoneNumber } from "../services/phoneFormatService";

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

    const reservationNumber = await getNextReservationNumber();
    
    // 3️⃣ יצירת הזמנת שולחן
    const booking = await TableModel.create({
      reservationNumber: reservationNumber,
      userId: payload.id,
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      people: req.body.people,
      date: req.body.date,
      note: req.body.note,
    });
    const bookingDate = new Date(booking.date);
    const formattedDate = bookingDate.toLocaleString("he-IL", {
      weekday: "long",   // יום רביעי
      day: "numeric",
      month: "long",     // דצמבר
      year: "numeric",
      hour: "2-digit",   // 18
      minute: "2-digit", // 30
    });
    const testMsg = `${name} היי, 
      בורגירו בר קיבל את הזמנת השולחן שלך. 
      מספר אנשים: ${people} 
      תאריך: ${formattedDate}
      תחכה להודעה לאישור ההזמנה.` ;
    const htmlMsg = `
          היי <b>${name}</b>,<br><br>
          בורגירו בר קיבל את הזמנת השולחן שלך.<br>
          <b>מספר אנשים:</b> ${people}<br>
          <b>תאריך:</b> ${formattedDate}<br><br>
          תחכה להודעה לאישור ההזמנה.
        `;
      await sendEmail({
        name: name,
        email: email,
        subject: "הזמנת שולחן",
        text: testMsg,
        html: htmlMsg,
      });
      await sendWhatsAppMessage(formatPhoneNumber(phone), testMsg);

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

export const getAllTables = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Check token
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 2️⃣ Verify token
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: string; role: string };

    // 3️⃣ Check admin role
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // 4️⃣ Fetch all table reservations from DB, sorted by date ascending
    const tables = await TableModel.find().sort({ reservationNumber: 1 }).lean();

    // 5️⃣ Return response
    return res.status(200).json({ reservations : tables });
  } catch (error) {
    console.error("Get all tables error:", error);
    return res.status(500).json({ message: "Failed to fetch table reservations" });
  }
};

export const updateTableStatus = async (req: Request, res: Response) => {
  try {
    // 1️⃣ Check token
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 2️⃣ Verify token
    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: string; role: string };

    // 3️⃣ Check admin role
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { reservationId } = req.params;
    const { status } = req.body;
    const { userData } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    // 4️⃣ Update reservation status
    const updatedReservation = await TableModel.findByIdAndUpdate(
      reservationId,
      { status },
      { new: true }
    ).lean();

    if (!updatedReservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    if(userData &&
       userData.userPhone !== undefined &&
        userData.userName !== undefined &&
         userData.userEmail !== undefined&&
         userData.people !== undefined&&
         userData.reservationDate !== undefined,
          status === "approved"){
    const formattedDate = new Date(userData.reservationDate).toLocaleString("he-IL", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
      const testMsg = `${userData.userName} היי, 
      בורגירו בר אישר את הזמנת השולחן שלך. 
      מספר אנשים: ${userData.people} 
      תאריך: ${formattedDate}
         מחכים לראות אותך` ;
    const htmlMsg = `
          היי <b>${userData.userName}</b>,<br><br>
          בורגירו בר אישר את הזמנת השולחן שלך.<br>
          <b>מספר אנשים:</b> ${userData.people}<br>
          <b>תאריך:</b> ${formattedDate}<br><br>
           מחכים לראות אותך` ;
      await sendEmail({
        name: userData.name,
        email: userData.email,
        subject: "הזמנת שולחן",
        text: testMsg,
        html: htmlMsg,
      });
      await sendWhatsAppMessage(formatPhoneNumber(userData.userPhone), testMsg);
    }
   
    return res.status(200).json({ message: "Reservation status updated", reservation: updatedReservation });
  } catch (error) {
    console.error("Update table status error:", error);
    return res.status(500).json({ message: "Failed to update reservation status" });
  }
};

export const getNewReservations = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as { id: string; role: string };

    if (payload.role !== "admin") return res.status(403).json({ message: "Access denied" });

    const afterReservationNumber = parseInt(req.query.after as string) || 0;
    if (isNaN(afterReservationNumber)) return res.status(400).json({ message: "Invalid reservation number" });

    // Fetch all reservations with number greater than lastNumber, sorted ascending
    const newReservations = await TableModel.find({ reservationNumber: { $gt: afterReservationNumber } })
      .sort({ reservationNumber: 1 })
      .lean();

    return res.status(200).json({ reservations: newReservations });
  } catch (error) {
    console.error("Get new reservations error:", error);
    return res.status(500).json({ message: "Failed to fetch new reservations" });
  }
};

export const mockInsertTableReservation = async (req: Request, res: Response) => {
  try {
    const userId = "69434b466f0feb4d4432fabf"; // fallback user ID

    const reservationId = new mongoose.Types.ObjectId();
    const reservationNumber = await getNextReservationNumber();

    const reservation = new TableModel({
      _id: reservationId,
      reservationNumber: reservationNumber,
      userId,
      name: "John Doe",
      phone: "0501234567",
      email: "johndoe@example.com",
      people: 4,
      date: new Date(), // now
      note: "Mock reservation note",
      status: "pending", // pending by default
    });

    await reservation.save();

    return res.status(201).json({
      message: "Mock table reservation inserted",
      reservation,
    });
  } catch (err) {
    console.error("Failed to insert mock table reservation:", err);
    return res.status(500).json({
      message: "Failed to insert mock table reservation",
    });
  }
};

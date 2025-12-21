import { Request, Response, NextFunction } from "express";
import { getPlaceSettings } from "../utils/getPlaceSettings";

export const openPlace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const settings = await getPlaceSettings();

    if (!settings?.isOpen) {
      return res.status(403).json({
        message: "המקום סגור כרגע, לא ניתן לבצע הזמנות",
      });
    }

    next(); // ✅ place is open → continue
  } catch (err) {
    console.error("openPlace middleware error:", err);
    return res.status(500).json({
      message: "Server error while checking place status",
    });
  }
};
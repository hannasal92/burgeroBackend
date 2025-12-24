import { Request, Response } from "express";
import { getPlaceSettings } from "../utils/getPlaceSettings";

export const getPlaceStatus = async (req: Request, res: Response) => {
  try {
    const settings = await getPlaceSettings();
    res.json({ open: settings.isOpen });
  } catch (err) {
    console.error("Failed to get place status:", err);
    res.status(500).json({ error: "Failed to get place status" });
  }
};

/* ================================
   TOGGLE OPEN / CLOSE (ADMIN)
================================= */
export const togglePlace = async (req: Request, res: Response) => {
  try {
    const { open } = req.body;

    const settings = await getPlaceSettings();
    settings.isOpen = open;

    await settings.save();

    res.json({ open: settings.isOpen });
  } catch (err) {
    console.error("Failed to toggle place:", err);
    res.status(500).json({ error: "Failed to toggle place" });
  }
};
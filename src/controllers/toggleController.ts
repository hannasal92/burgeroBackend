import { Request, Response } from "express";
import { getPlaceSettings } from "../utils/getPlaceSettings";

export const getPlaceStatus = async (req: Request, res: Response) => {
  const settings = await getPlaceSettings();
  res.json({ open: settings.isOpen });
};

/* ================================
   TOGGLE OPEN / CLOSE (ADMIN)
================================= */
export const togglePlace = async (req: Request, res: Response) => {
  const { open } = req.body;

  const settings = await getPlaceSettings();

  settings.isOpen = open;

  await settings.save();

  res.json({ open: settings.isOpen });
};


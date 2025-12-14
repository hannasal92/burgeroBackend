import { Request, Response } from "express";


export const submitPayment = async (req: Request, res: Response) => {
  try {
    
    return res.status(200).json({ message : "yes" });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
};
import { Request, Response } from "express";
import { ProductModel } from "../models/Product";

const products = [
  {
    "name": "פיצה מרגריטה",
    "category" : "pizza",
    "description": "פיצה קלאסית עם רוטב עגבניות וגבינה איכותית.",
    "price": 32,
    "additions": [
      { "name": "Cheese", "price": 5 },
    ],
    "image": "f1.png",
  },

  {
    "name": "בורגר בקר קלאסי",
     "category" : "burger",
    "description": "המבורגר עסיסי מבשר בקר טרי, בלחמנייה רכה.",
    "price": 55,
    "additions": [
      { "name": "Cheese", "price": 5 },
      { "name": "Bacon", "price": 7 },
      { "name": "Extra Meat", "price": 10 }
    ],
    "image": "f2.png",
  },

  {
    "name": "פסטה אלפרדו",
    "category" : "pasta",
    "description": "פסטה ברוטב שמנת עשיר ופרמזן.",
    "price": 45,
    "additions": [
      { "name": "Mushrooms", "price": 4 },
      { "name": "Parmesan", "price": 3 }
    ],
    "image": "f3.png",
  },

  {
    "name": "צ׳יפס פריך",
    "category" : "fries",
    "description": "צ׳יפס זהוב, קריספי ומטובל.",
    "price": 18,
    "additions": [
      { "name": "Cheese Sauce", "price": 4 },
      { "name": "Spicy Dip", "price": 3 }
    ],
    "image": "f4.png",
  }
]

export const addProduct = async (req: Request, res: Response) => {
  try {
    const result = await ProductModel.create(products);
    
    return res.json({ messages: "all products inserted successfully" });
  } catch {
    return res.sendStatus(403);
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const products = await ProductModel.find();

    return res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Failed to fetch products" });
  }
};
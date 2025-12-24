import { Schema, model } from "mongoose";

const ProductSchema = new Schema({
  name: { type: String, required: true, unique: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },

  // Category limited to 4 options
  category: { 
    type: String,
    required: true,
    enum: ["fries", "pizza", "burger", "pasta"] 
  },

  // Array of additions
  additions: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
    }
  ],

  // Image URL or path
  image: { type: String },

  createdAt: { type: Date, default: () => new Date() }
});

export const ProductModel = model("Product", ProductSchema);
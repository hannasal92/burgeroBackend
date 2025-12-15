import { Schema, model, Types } from "mongoose";

// Item inside the order
const OrderItemSchema = new Schema({
  productId: { type: Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl : {type: String},
  quantity: { type: Number, required: true },
  selectedAdditions: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
    }
  ],
  totalPrice: { type: Number, required: true }, // price * quantity + additions
  note: { type: String },
});

// Main order schema
const OrderSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true }, // the user placing the order
  items: [OrderItemSchema], // the products in the order
  paymentType: { type: String, enum: ["cash", "creditCard"], required: true },
  total: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
  createdAt: { type: Date, default: () => new Date() },
  updatedAt: { type: Date, default: () => new Date() },
});

export const OrderModel = model("Order", OrderSchema);
import { Schema, model, Types } from "mongoose";

// Item inside the order
const OrderItemSchema = new Schema({
  productId: {
    type: Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
  selectedAdditions: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalPrice: {
    type: Number,
    required: true, // price * quantity + additions
  },
  note: {
    type: String,
  },
});

// Main order schema
const OrderSchema = new Schema(
  {
    orderNumber: { type: Number, unique: true, index: true }, // ✅
    delivery: {type: Number, default : 0},
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
    },
    paymentType: {
      type: String,
      enum: ["cash", "creditCard"],
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "process", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true, // ✅ automatically adds createdAt & updatedAt
  }
);

export const OrderModel = model("Order", OrderSchema);
import { Schema, model, Types } from "mongoose";

const TableSchema = new Schema(
  {
    // 🔐 המשתמש שביצע את ההזמנה
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 👤 פרטי המזמין
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
    },

    // 👥 מספר אנשים
    people: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },

    // 📅 תאריך ההזמנה
    date: {
      type: Date,
      required: true,
    },

    // 📌 סטטוס הזמנה
    status: {
      type: String,
      enum: ["pending", "approved", "canceled"],
      default: "pending",
    },

    // 📝 הערה אופציונלית
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
  }
);

export const TableModel = model("Table", TableSchema);
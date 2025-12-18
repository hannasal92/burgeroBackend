import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true, unique: false },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true},
  createdAt: { type: Date, default: () => new Date() },
    role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

export const UserModel = model("User", UserSchema);
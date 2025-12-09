import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true},
  createdAt: { type: Date, default: () => new Date() },
});

export const UserModel = model("User", UserSchema);
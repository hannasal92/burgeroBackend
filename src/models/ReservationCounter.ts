import { Schema, model } from "mongoose";

const ReservationCounterSchema = new Schema({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

export const ReservationCounterModel = model("ReservationCounter", ReservationCounterSchema);
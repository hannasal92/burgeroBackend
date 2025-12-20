import { ReservationCounterModel } from "../models/ReservationCounter";

export async function getNextReservationNumber() {
  const counter = await ReservationCounterModel.findOneAndUpdate(
    { name: "table" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
}
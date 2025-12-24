import { CounterModel } from "../models/Counter";

export async function getNextOrderNumber() {
  const counter = await CounterModel.findOneAndUpdate(
    { name: "order" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return counter.seq;
}
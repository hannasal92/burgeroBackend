import { Schema, model, Types } from "mongoose";

const PlaceSettingsSchema = new Schema(
  {
    isOpen: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);
export const placeSettingModel = model("PlaceSettings", PlaceSettingsSchema);
import { placeSettingModel } from "../models/PlaceSettings";

export const getPlaceSettings = async () => {
  try {
    let settings = await placeSettingModel.findOne();

    if (!settings) {
      settings = await placeSettingModel.create({ isOpen: false });
    }

    return settings;
  } catch (err) {
    console.error("Error fetching place settings:", err);
    throw new Error("Failed to get place settings");
  }
};
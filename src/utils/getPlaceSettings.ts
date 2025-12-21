
import { placeSettingModel } from "../models/PlaceSettings";

export const getPlaceSettings = async () => {
  let settings = await placeSettingModel.findOne();

  if (!settings) {
    settings = await placeSettingModel.create({ isOpen: false });
  }

  return settings;
};
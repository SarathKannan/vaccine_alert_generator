const OneSignal = require("onesignal-node");
import { onesignal_api_key, onesignal_app_id } from "../../config";
import { logger } from "../@others";

export const Onesignal = async (data_obj) => {
  const { msg, player_id, heading } = data_obj;
  const notification = {
    contents: {
      en: msg || `Hurry, slots updated`,
    },
    include_player_ids: [player_id],
    headings: {
      en: heading || "Covid-19 vaccine alert",
    },
  };
  try {
    const client = new OneSignal.Client(onesignal_app_id, onesignal_api_key);
    const response = await client.createNotification(notification);
    logger([response.body.id]);
    return response.body.id;
  } catch (e) {
    if (e instanceof OneSignal.HTTPError) {
      logger([e.statusCode, e.body]);
    }
    return false;
  }
};

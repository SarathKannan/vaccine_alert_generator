import { logger } from "../../services/@others";
import { Onesignal } from "../../services/onesignal";
import Notification from "./modal";

export const create_notification = async (err, data) => {
  logger(["create_notification", data]);
  if (!err) {
    const { pincode, req_date, player_id, result } = data;

    if (result[0].centers !== undefined && result[0].centers.length > 0) {
      const notification_data = {
        msg: `Hurry, slots updated for your subscribed pincode ${pincode} on ${req_date}`,
        player_id,
        heading: "Covid-19 vaccine alert",
      };
      const response_id = await Onesignal(notification_data);
      if (response_id) {
        const instance = { ...data };
        instance.display_msg = notification_data.msg;
        instance.success_id = response_id;
        instance.result = result[0];

        const create = await Notification.create(instance, () =>
          logger(["Created"])
        );
      }
    }
  }
};

import fetch from "node-fetch";
import cron from "node-cron";
import { cron_intervel } from "../../config";
import Alert from "../../api/alert/model";
import { watcher } from "../../api/webWatcher/controller";

export const logger = (val_array = []) => {
  val_array.map((e) => console.log(e));
};

export const get = async (url) => {
  logger([url])
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const respJSON = await response.json();
      return respJSON;
    } else {
      return { error: true };
    }
  } catch (error) {
    return { error: true };
  }
};

export const timer = async () => {
  try {
    const alert_data_all = await Alert.find({});
    if (alert_data_all) {
      cron.schedule(cron_intervel, () => {
        logger(["running a task every 30 minutes inside"]);
        watcher()
      });
    }
  } catch (error) {}
};

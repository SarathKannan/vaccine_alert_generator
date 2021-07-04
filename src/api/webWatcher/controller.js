import moment from "moment";
import delay from "delay";
import _ from "lodash";

import { public_url, valid_days } from "../../config";
import { get, logger } from "../../services/@others";
import WebWatch from "./modal";
import Alert from "../alert/model";
import { create_notification } from "../notification/controller";
import { remove } from "../alert/controller";

const is_age_limit_ok = (age, age_group) => {
  if (
    age_group === null ||
    age_group === "" ||
    age_group === 0 ||
    age_group === undefined
  ) {
    return true;
  } else {
    return age_group === age;
  }
};
const isArrayEqual = function (x, y) {
  return _(x).xorWith(y, _.isEqual).isEmpty();
};

export const fetch_and_update = async (req_data, alertId, from) => {
  logger(["fetch_and_update"]);
  let date = moment().format("DD-MM-YYYY");
  const {
    deviceId,
    pincode,
    requestDate = date,
    player_id,
    age_group = 0,
  } = req_data;
  try {
    let url = `${public_url}/calendarByPin?pincode=${pincode}&date=${requestDate}`;
    const result = await get(url);

    const is_dose_available_arr = [];
    const let_filter = await result.centers.map((cntr) => {
      cntr.sessions.map((e) => {
        if (
          e.available_capacity > 0 &&
          is_age_limit_ok(e.min_age_limit, age_group)
        ) {
          is_dose_available_arr.push(cntr);
          logger(["dose avilable", cntr])
        } else {
          logger(["dose not avilable"])
        }
      });
    });

    if (is_dose_available_arr.length > 0) {
      const instance = {
        deviceId,
        player_id,
        result,
        pincode,
        req_date : requestDate,
        alert_id: alertId,
        age_group,
      };
      if (from !== "watcher") {
        const create_response = await WebWatch.create(instance);
        return false;
      }
      return instance;
    }
    return false;
  } catch (error) {
    logger([{ error: error }]);
    return false;
  }
};

export const watcher = async () => {
  try {
    const alert_data_all = await Alert.find({});
    logger(["watcher"]);
    if (alert_data_all) {
      (async () => {
        for (let i = 0; i < alert_data_all.length; i++) {
          alert_data_all[i].alerts.map(async (item) => {
            if (item.pincode !== "") {
              let today = moment();
              let old_date = moment(item.requestDate, "DD-MM-YYYY");
              let difference = today.diff(old_date, "days");
              let _obj = {
                alert_id: item.id,
                deviceId: alert_data_all[i].deviceId,
              };
              if (difference > valid_days) {
                console.log("inside - no findings & remove alert");
                _obj.from = "watcher"
                remove({body : _obj})
              } else {
                _obj.pincode = item.pincode;
                _obj.player_id = alert_data_all[i].player_id;
                _obj.requestDate = item.requestDate;
                _obj.age_group = item.age_group;

                const fetchData = await fetch_and_update(
                  _obj,
                  item.id,
                  "watcher"
                );
                if (fetchData) {
                  const { deviceId, pincode, result } = fetchData;
                  const watcher_data = await WebWatch.find({
                    deviceId: deviceId,
                  });
                  if (watcher_data.length > 0) {
                    const watcher_u_data = _.uniqBy(watcher_data, "alert_id");
                    watcher_u_data.map((data, i) => {
                      const wa_result = watcher_u_data[i].result;
                      if (Array.isArray(wa_result)) {
                        if (data.pincode === pincode) {
                          if (
                            wa_result[0].centers !== undefined &&
                            result.centers !== undefined
                          ) {
                            if (Array.isArray(wa_result[0].centers)) {
                              const filter_data = wa_result[0].centers.filter(
                                (item) => {
                                  return item.pincode === Number(pincode);
                                }
                              );
                              var isSameData = isArrayEqual(
                                filter_data,
                                result.centers
                              );
                              if (isSameData) {
                                console.log("is same data no need to notify");
                              } else {
                                WebWatch.findOneAndUpdate(
                                  { pincode: pincode },
                                  { result: result },
                                  create_notification
                                );
                              }
                            }
                          }
                        }
                      }
                    });
                  }
                }
              }
              await delay(3000);
              logger(["Executed 3000 milliseconds later"]);
            }
          });
        }
      })();
    }
  } catch (error) {}
};

import _ from "lodash";
import moment from "moment";

import { logger } from "../../services/@others";
import { errors, notFound, success } from "../../services/response";
import { fetch_and_update } from "../webWatcher/controller";
import Alert from "./model";
import WebWatch from "../webWatcher/modal";
import { valid_days } from "../../config";

export const create = async (req, res) => {
  logger([{ body: req.body }]);

  const {
    deviceId,
    pincode = "",
    requestDate = moment().format("DD-MM-YYYY"),
    district = "",
    player_id = "",
    age_group = 0,
  } = req.body;

  const query = { deviceId: deviceId };
  try {
    const alert_data = await Alert.find(query);
    if (alert_data.length > 0) {
      const alerts = alert_data[0].alerts;
      const duplicate = alerts.filter((e) => e.pincode === pincode);

      if (duplicate.length > 0) {
        success(
          res,
          200
        )({
          error: false,
          success: true,
          msg: `You are already subscribed for the pincode ${duplicate[0].pincode}`,
        });
      } else {
        const id_arr = alerts.map((e) => e.id);
        const id_max = _.max(id_arr);
        let obj = {
          pincode,
          requestDate,
          district,
          age_group,
        };
        let newArray = [];

        if (alerts.length > 0) {
          obj.id = id_max + 1;
          newArray = [...alerts, obj];
          logger(["lenth is more"]);
        } else {
          obj.id = 1;
          newArray = [obj];
          logger(["lenth is 0"]);
        }

        const update_alert = await Alert.findOneAndUpdate(query, {
          alerts: newArray,
        });
        if (update_alert) {
          success(
            res,
            200
          )({
            error: false,
            success: true,
            msg: "Alert updated Successfully!",
          });
        } else errors(res)(404);
        fetch_and_update(req.body, obj.id);
      }
    } else {
      const instance = {
        deviceId,
        player_id,
        alerts: [
          {
            id: 1,
            pincode: pincode,
            requestDate: requestDate,
            district: district,
            age_group: age_group,
          },
        ],
      };
      const create = await Alert.create(instance);
      if (create) {
        success(
          res,
          200
        )({
          error: false,
          success: true,
          msg: "Alert Created Successfully!",
        });
      } else errors(res)(404);
      fetch_and_update(req.body, 1);
    }
  } catch (error) {
    logger(["catch error", { error: error }]);
  }
};

export const remove = async (req, res) => {
  const { deviceId, alert_id, from } = req.body;
  const query_alert = { deviceId: deviceId };
  const query_watch = { deviceId: deviceId, alert_id: alert_id };
  try {
    const alert_data = await Alert.find(query_alert);
    if (alert_data.length > 0) {
      const f_array = alert_data[0].alerts.filter(
        (item) => item.id !== alert_id
      );
      const _update = await Alert.findOneAndUpdate(query_alert, {
        alerts: f_array,
      });
      if (_update) {
        const update_watcher = await WebWatch.findOneAndDelete(query_watch);
        from !== "watcher" &&
          success(
            res,
            200
          )({
            error: false,
            success: true,
            msg: "Deleted Successfully!",
          });
      }
    } else {
      from !== "watcher" && notFound(res);
    }
  } catch (error) {
    logger([error]);
    from !== "watcher" && errors(res)(404);
  }
};

export const getList = async (req, res) => {
  let query = req.querymen;
  let select = {
    _id: 1,
    pincode: 1,
    updatedAt: 1,
    req_date: 1,
    deviceId: 1,
    result: 1,
    alert_id: 1,
    age_group: 1,
  };
  try {
    const watcher_list = await WebWatch.find(query.query, select, query.cursor);
    if (watcher_list.length > 0) {
      const filteredArr = watcher_list.map((item) => {
        let today = moment();
        let old_date = moment(item.req_date, "DD-MM-YYYY");
        let difference = today.diff(old_date, "days");
        let diff_in_sec = today.diff(old_date);
        let valid_for;
        if (diff_in_sec < 0) {
          valid_for = null;
        } else {
          valid_for = valid_days - difference;
        }
        console.log("difference", difference, valid_for, diff_in_sec);
        item.valid_for = valid_for;
        item.result = item.result[0];
        return item;
      });
      success(
        res,
        200
      )({
        error: false,
        success: true,
        msg: "Success",
        data: filteredArr,
      });
    } else errors(res)(404);
  } catch (error) {
    errors(res)(404);
  }
};

require("dotenv").config();

var config = {
  api: "/channel.cowin.vac.com/api/v1",
  mongo: process.env.DB || "mongodb://0.0.0.0:27017/vaccine_alert",
  onesignal_app_id: process.env.ONE_SIGNAL_APP_ID,
  onesignal_api_key: process.env.ONE_SIGNAL_API_KEY,
  host: process.env.HOST || "0.0.0.0", //host ip address
  port: process.env.PORT || 3060,
  public_url: "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public",
  cron_intervel: "*/50 * * * * *", // 5 * for seconds, 4 * for minutes
  valid_days: 5,
};

module.exports = config;

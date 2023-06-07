import { addDailyReport } from "../service/dailyReport.service";

const cron = require("node-cron");

const dailyReport = {
  stationId: "6464e9f1c45b82216ab1db6b",
};

export const daily = () =>
  cron.schedule("0 0 * * *", async () => {
    try {
      await addDailyReport(dailyReport);
      console.log(new Date());
    } catch (e) {
      console.log(e);
    }
  });

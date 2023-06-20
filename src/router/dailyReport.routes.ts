import {
  getDailyReportHandler,
  addDailyReportHandler,
  updateDailyReportHandler,
  deleteDailyReportHandler,
  getDailyReportByDateHandler,
  // getDailyReportTest,
} from "../controller/dailyReport.controller";
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import { allSchemaId, dailyReportSchema } from "../schema/scheama";
const dailyReportRoute = require("express").Router();

dailyReportRoute.get(
  "/pagi/:page",
  validateToken,
  hasAnyPermit(["view"]),
  getDailyReportHandler
);

dailyReportRoute.post(
  "/",
  validateToken,
  roleValidator("admin"),
  hasAnyPermit(["add"]),
  validateAll(dailyReportSchema),
  addDailyReportHandler
);
dailyReportRoute.patch(
  "/",
  validateToken,
  roleValidator("admin"),
  hasAnyPermit(["edit"]),
  validateAll(allSchemaId),
  updateDailyReportHandler
);
dailyReportRoute.delete(
  "/",
  validateToken,
  roleValidator("admin"),
  hasAnyPermit(["delete"]),
  validateAll(allSchemaId),
  deleteDailyReportHandler
);

dailyReportRoute.get(
  "/by-date/:page",
  validateToken,
  hasAnyPermit(["view"]),
  getDailyReportByDateHandler
);

export default dailyReportRoute;

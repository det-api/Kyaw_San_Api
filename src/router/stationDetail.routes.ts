import {
  getStationDetailHandler,
  addStationDetailHandler,
  updateStationDetailHandler,
  deleteStationDetailHandler,
} from "../controller/stationDetail.controller";

import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import { allSchemaId, stationDetailSchema } from "../schema/scheama";
const stationDetailRoute = require("express").Router();

stationDetailRoute.get(
  "/:page",
  validateToken,
  hasAnyPermit(["view"]),
  getStationDetailHandler
);

stationDetailRoute.post(
  "/",
  validateToken,
  roleValidator(["admin"]),
  hasAnyPermit(["add"]),
  validateAll(stationDetailSchema),
  addStationDetailHandler
);

stationDetailRoute.patch(
  "/",
  validateToken,
  roleValidator(["admin"]),
  hasAnyPermit(["edit"]),
  validateAll(allSchemaId),
  updateStationDetailHandler
);

stationDetailRoute.delete(
  "/",
  validateToken,
  validateAll(allSchemaId),
  roleValidator(["admin"]),
  hasAnyPermit(["delete"]),
  deleteStationDetailHandler
);

export default stationDetailRoute;

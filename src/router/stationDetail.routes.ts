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
  // validateToken,
  // hasAnyPermit(["view"]),
  getStationDetailHandler
);

stationDetailRoute.post(
  "/",
  // validateToken,
  // validateAll(stationDetailSchema),
  // roleValidator("admin"),
  // hasAnyPermit(["add"]),
  addStationDetailHandler
);

stationDetailRoute.patch(
  "/",
  validateToken,
  validateAll(allSchemaId),
  roleValidator("admin"),
  hasAnyPermit(["edit"]),
  updateStationDetailHandler
);

stationDetailRoute.delete(
  "/",
  validateToken,
  validateAll(allSchemaId),
  roleValidator("admin"),
  hasAnyPermit(["delete"]),
  deleteStationDetailHandler
);

export default stationDetailRoute;

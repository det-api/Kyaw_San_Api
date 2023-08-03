import { validateAll, validateToken } from "../middleware/validator";
import { roleValidator } from "../middleware/roleValidator";
import { allSchemaId } from "../schema/scheama";
import {
  addCheckStationHandler,
  deletCheckStationHandler,
  getCheckStationHandler,
} from "../controller/checkStation.controller";

const checkStationRoute = require("express").Router();

checkStationRoute.get(
  "/",

  getCheckStationHandler
);
checkStationRoute.post(
  "/new",
  validateToken,
  roleValidator(["admin"]),
  addCheckStationHandler
);
checkStationRoute.delete(
  "/",
    validateToken,
    validateAll(allSchemaId),
    roleValidator(["admin"]),
  deletCheckStationHandler
);

export default checkStationRoute;

import { validateAll, validateToken } from "../middleware/validator";
import { roleValidator } from "../middleware/roleValidator";
import { allSchemaId } from "../schema/scheama";
import {
  addTempHandler,
  deletTempHandler,
  getTempHandler,
} from "../controller/temp.controller";

const tempRoute = require("express").Router();

tempRoute.get(
  "/",
  validateToken,
  validateAll(allSchemaId),
  roleValidator(["admin"]),
  getTempHandler
);
tempRoute.post(
  "/new",
  validateToken,
  roleValidator(["installer"]),
  addTempHandler
);
tempRoute.delete(
  "/",
  validateToken,
  validateAll(allSchemaId),
  roleValidator(["admin"]),
  deletTempHandler
);

export default tempRoute;

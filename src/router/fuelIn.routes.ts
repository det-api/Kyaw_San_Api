import {
  addFuelInHandler,
  deleteFuelInHandler,
  getFuelInHandler,
  updateFuelInHandler,
} from "../controller/fuelIn.controller";
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import { allSchemaId, fuelInSchema } from "../schema/scheama";
const fuelInRoute = require("express").Router();

fuelInRoute.get(
  "/:page",
  // validateToken,
  // hasAnyPermit(["view"]),
  getFuelInHandler
);

fuelInRoute.post(
  "/",
  // validateToken,
  // roleValidator("admin"),
  // hasAnyPermit(["add"]),
  addFuelInHandler
);
fuelInRoute.patch(
  "/",
  validateToken,
  roleValidator("admin"),
  hasAnyPermit(["edit"]),
  validateAll(allSchemaId),
  updateFuelInHandler
);
fuelInRoute.delete(
  "/",
  validateToken,
  roleValidator("admin"),
  hasAnyPermit(["delete"]),
  validateAll(allSchemaId),
  deleteFuelInHandler
);

export default fuelInRoute;

import {
  addFuelBalanceHandler,
  deleteFuelBalanceHandler,
  getAllFuelBalanceHandler,
  getFuelBalanceByDateHandler,
  getFuelBalanceHandler,
  updateFuelBalanceHandler,
} from "../controller/fuelBalance.controller";
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
const fuelBalanceRoute = require("express").Router();

fuelBalanceRoute.get(
  "/all",
  validateToken,
  hasAnyPermit(["view"]),
  getAllFuelBalanceHandler
);

fuelBalanceRoute.get(
  "/pagi/:page",
  validateToken,
  hasAnyPermit(["view"]),
  getFuelBalanceHandler
);
fuelBalanceRoute.get(
  "/by-date",
  validateToken,
  hasAnyPermit(["view"]),
  getFuelBalanceByDateHandler
);
fuelBalanceRoute.post(
  "/",
  validateToken,
  roleValidator("admin"),
  hasAnyPermit(["add"]),
  addFuelBalanceHandler
);

fuelBalanceRoute.patch(
  "/",
  validateToken,
  roleValidator("admin"),
  hasAnyPermit(["edit"]),
  updateFuelBalanceHandler
);

fuelBalanceRoute.delete(
  "/",
  validateToken,
  roleValidator("admin"),
  hasAnyPermit(["delete"]),
  deleteFuelBalanceHandler
);

export default fuelBalanceRoute;

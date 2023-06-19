import {
  getPermitHandler,
  addPermitHandler,
  deletPermitHandler,
} from "../controller/permit.controller";
import { validateAll, validateToken } from "../middleware/validator";
import { roleValidator } from "../middleware/roleValidator";
import { allSchemaId, permitSchema } from "../schema/scheama";

const permitRoute = require("express").Router();

permitRoute.get(
  "/",
  // validateToken,
  // roleValidator("admin"),
  getPermitHandler
);
permitRoute.post(
  "/",
  validateToken,
  validateAll(permitSchema),
  roleValidator("admin"),
  addPermitHandler
);
permitRoute.delete(
  "/",
  validateToken,
  validateAll(allSchemaId),
  roleValidator("admin"),
  deletPermitHandler
);

export default permitRoute;

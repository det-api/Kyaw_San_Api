import {
  getRoleHandler,
  addRoleHandler,
  deletRoleHandler,
  roleAddPermitHandler,
  roleRemovePermitHandler,
} from "../controller/role.controller";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import { roleSchema } from "../utils/schema";

const roleRoute = require("express").Router();

roleRoute.get("/", validateToken, roleValidator("admin"), getRoleHandler);

roleRoute.post(
  "/",
  validateToken,
  roleValidator("admin"),
  validateAll(roleSchema),
  addRoleHandler
);

roleRoute.delete("/", validateToken, roleValidator("admin"), deletRoleHandler);

roleRoute.patch(
  "/add/permit",
  validateToken,
  roleValidator("admin"),
  roleAddPermitHandler
);

roleRoute.patch(
  "/remove/permit",
  validateToken,
  roleValidator("admin"),
  roleRemovePermitHandler
);

export default roleRoute;

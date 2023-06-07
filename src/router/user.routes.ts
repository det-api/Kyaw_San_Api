const userRoute = require("express").Router();
import {
  deleteUserHandler,
  getUserByAdminHandler,
  getUserHandler,
  loginUserHandler,
  registerUserHandler,
  updateUserHandler,
  userAddPermitHandler,
  userAddRoleHandler,
  userRemovePermitHandler,
  userRemoveRoleHandler,
} from "../controller/user.controller";
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateToken } from "../middleware/validator";

//register user
userRoute.post("/register", registerUserHandler);

//login user
userRoute.post("/login", loginUserHandler);

//update
userRoute.patch(
  "/",
  validateToken,
  roleValidator("admin"),
  hasAnyPermit(["edit"]),
  updateUserHandler
);

//getuser
userRoute.get("/", validateToken, getUserHandler);

//delete each user
userRoute.delete("/", validateToken, deleteUserHandler);

//admin routes
//beware deleting all user route
userRoute.delete("/admin", validateToken, deleteUserHandler);
userRoute.get("/admin", validateToken, getUserByAdminHandler);

//adding role in user
userRoute.patch(
  "/add/role",
  validateToken,
  roleValidator("admin"),
  hasAnyPermit(["add"]),
  userAddRoleHandler
);

userRoute.patch(
  "/remove/role",
  validateToken,
  roleValidator("admin"),
  hasAnyPermit(["delete"]),
  userRemoveRoleHandler
);

//adding permit in user
userRoute.patch(
  "/add/permit",
  validateToken,
  roleValidator("admin"),
  hasAnyPermit(["add"]),
  userAddPermitHandler
);
userRoute.patch(
  "/remove/permit",
  validateToken,
  roleValidator("admin"),
  hasAnyPermit(["delete"]),
  userRemovePermitHandler
);

export default userRoute;

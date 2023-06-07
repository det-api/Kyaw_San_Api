import {
  addDetailSaleHandler,
  deleteDetailSaleHandler,
  detailSalePaginateHandler,
  getDetailSaleHandler,
  updateDetailSaleHandler,
} from "../controller/detailSale.controller";
import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import { allSchemaId, detailSaleSchema } from "../schema/scheama";

const detailSaleRoute = require("express").Router();

detailSaleRoute.get(
  "/",
  validateToken,
  hasAnyPermit(["view"]),
  getDetailSaleHandler
);

//that for only device
detailSaleRoute.post("/", addDetailSaleHandler);
detailSaleRoute.patch("/", updateDetailSaleHandler);

detailSaleRoute.delete(
  "/",
  validateToken,
  roleValidator("admin"),
  hasAnyPermit(["delete"]),
  validateAll(allSchemaId),
  deleteDetailSaleHandler
);

detailSaleRoute.get(
  "/pagi/:page",
  // validateToken,
  // hasAnyPermit(["view"]),
  detailSalePaginateHandler
);

export default detailSaleRoute;

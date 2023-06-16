import {
  addDetailSaleHandler,
  deleteDetailSaleHandler,
  getDetailSaleByDate,
  getDetailSaleHandler,
  updateDetailSaleHandler,
} from "../controller/detailSale.controller";

import { hasAnyPermit } from "../middleware/permitValidator";
import { roleValidator } from "../middleware/roleValidator";
import { validateAll, validateToken } from "../middleware/validator";
import { allSchemaId, detailSaleSchema } from "../schema/scheama";

const detailSaleRoute = require("express").Router();

detailSaleRoute.get(
  "/pagi/:page",
  validateToken,
  hasAnyPermit(["view"]),
  getDetailSaleHandler
);

detailSaleRoute.get("/by-date" , getDetailSaleByDate)

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

export default detailSaleRoute;

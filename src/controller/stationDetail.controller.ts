import { Request, Response, NextFunction } from "express";
import fMsg from "../utils/helper";
import {
  getStationDetail,
  addStationDetail,
  updateStationDetail,
  deleteStationDetail,
  stationDetailPaginate,
  stationDetailCount,
} from "../service/stationDetail.service";

export const getStationDetailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pageNo = Number(req.params.page);

    let result = await stationDetailPaginate(pageNo, req.query);
    let totalCount = await stationDetailCount();
    fMsg(res, "StationDetail are here", result, totalCount);
  } catch (e) {
    next(new Error(e));
  }
};

export const addStationDetailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await addStationDetail(req.body);
    fMsg(res, "New StationDetail data was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const updateStationDetailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await updateStationDetail(req.query, req.body);
    fMsg(res, "updated StationDetail data", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deleteStationDetailHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteStationDetail(req.query);
    fMsg(res, "StationDetail data was deleted");
  } catch (e) {
    next(new Error(e));
  }
};

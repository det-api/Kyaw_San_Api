import { Request, Response, NextFunction } from "express";
import fMsg from "../utils/helper";
import {
  getDailyReport,
  addDailyReport,
  updateDailyReport,
  deleteDailyReport,
  getDailyReportByDate,
  dailyReportPaginate,
} from "../service/dailyReport.service";
import {
  getDetailSale,
  getDetailSaleByFuelType,
} from "../service/detailSale.service";

export const getDailyReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pageNo = Number(req.params.page);

    let { data, count } = await dailyReportPaginate(pageNo, req.query);

    const result = await Promise.all(
      data.map(async (ea) => {
        ea["ninety-two"] = await getDetailSaleByFuelType(
          ea["dateOfDay"],
          "001-Octane Ron(92)"
        );
        ea["ninety-five"] = await getDetailSaleByFuelType(
          ea["dateOfDay"],
          "002-Octane Ron(95)"
        );
        ea["HSD"] = await getDetailSaleByFuelType(
          ea["dateOfDay"],
          "004-Diesel"
        );
        ea["PHSD"] = await getDetailSaleByFuelType(
          ea["dateOfDay"],
          "005-Premium Diesel"
        );
        return {
          _id: ea["_id"],
          stationId: ea["stationId"],
          dateOfDay: ea["dateOfDay"],
          date: ea["date"],
          prices: ea["prices"],
          "ninety-two": ea["ninety-two"],
          "ninety-five": ea["ninety-five"],
          HSD: ea["HSD"],
          PHSD: ea["PHSD"],
        };
      })
    );

    fMsg(res, "DailyReport are here", result, count);
  } catch (e) {
    next(new Error(e));
  }
};

export const addDailyReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await addDailyReport(req.body);
    fMsg(res, "New DailyReport data was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const updateDailyReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await updateDailyReport(req.query, req.body);
    fMsg(res, "updated DailyReport data", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deleteDailyReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteDailyReport(req.query);
    fMsg(res, "DailyReport data was deleted");
  } catch (e) {
    next(new Error(e));
  }
};

export const getDailyReportByDateHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sDate: any = req.query.sDate;
    let eDate: any = req.query.eDate;
    let pageNo: number = Number(req.params.page);

    delete req.query.sDate;
    delete req.query.eDate;

    let query = req.query;

    let result;
    if (!sDate) {
      throw new Error("you need date");
    }
    if (!eDate) {
      eDate = new Date();
    }
    // console.log("drp");
    //if date error ? you should use split with T or be sure detail Id
    const startDate: Date = new Date(sDate);
    const endDate: Date = new Date(eDate);

    result = await getDailyReportByDate(query, startDate, endDate, pageNo);
    // console.log(result);
    const resultWithDetails = await Promise.all(
      result.map(async (ea) => {
        ea["ninety-two"] = await getDetailSaleByFuelType(
          ea["dateOfDay"],
          "001-Octane Ron(92)"
        );
        ea["ninety-five"] = await getDetailSaleByFuelType(
          ea["dateOfDay"],
          "002-Octane Ron(95)"
        );
        ea["HSD"] = await getDetailSaleByFuelType(
          ea["dateOfDay"],
          "004-Diesel"
        );
        ea["PHSD"] = await getDetailSaleByFuelType(
          ea["dateOfDay"],
          "005-Premium Diesel"
        );
        return {
          _id: ea["_id"],
          stationId: ea["stationId"],
          dateOfDay: ea["dateOfDay"],
          date: ea["date"],
          prices: ea["prices"],
          "ninety-two": ea["ninety-two"],
          "ninety-five": ea["ninety-five"],
          HSD: ea["HSD"],
          PHSD: ea["PHSD"],
        };
      })
    );

    fMsg(res, "between two date", resultWithDetails);
  } catch (e) {
    next(new Error(e));
  }
};

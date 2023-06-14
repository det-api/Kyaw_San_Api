import { Request, Response, NextFunction } from "express";
import fMsg, { previous } from "../utils/helper";
import {
  getDetailSale,
  addDetailSale,
  updateDetailSale,
  deleteDetailSale,
  detailSalePaginate,
} from "../service/detailSale.service";
import {
  addFuelBalance,
  calcFuelBalance,
  getFuelBalance,
} from "../service/fuelBalance.service";
import { fuelBalanceDocument } from "../model/fuelBalance.model";

export const getDetailSaleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pageNo = Number(req.params.page);
    let result = await detailSalePaginate(pageNo, req.query);
    fMsg(res, "DetailSale are here", result);
  } catch (e) {
    next(new Error(e));
  }
};

//import
export const addDetailSaleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //that is remove after pos updated
    let check = await getDetailSale({ vocono: req.body.vocono });
    if (check.length != 0) {
      fMsg(res, "Data with that Vocono is already exist");
      return;
    }

    let result = await addDetailSale(req.body);

    let checkDate = await getFuelBalance({
      stationId: req.body.stationDetailId,
      createAt: req.body.dailyReportDate,
    });
    if (checkDate.length == 0) {
      let prevDate = previous(new Date(req.body.dailyReportDate));
      let prevResult = await getFuelBalance({
        stationId: req.body.stationDetailId,
        createAt: prevDate,
      });
      // console.log(prevResult);
      await Promise.all(
        prevResult.map(async (ea) => {
          let obj: fuelBalanceDocument;
          if (ea.balance == 0) {
            obj = {
              stationId: ea.stationId,
              fuelType: ea.fuelType,
              capacity: ea.capacity,
              opening: ea.opening + ea.fuelIn,
              tankNo: ea.tankNo,
              createAt: req.body.dailyReportDate,
              nozzles: ea.nozzles,
              balance: ea.opening + ea.fuelIn,
            } as fuelBalanceDocument;
          } else {
            obj = {
              stationId: ea.stationId,
              fuelType: ea.fuelType,
              capacity: ea.capacity,
              opening: ea.opening + ea.fuelIn - ea.cash,
              tankNo: ea.tankNo,
              createAt: req.body.dailyReportDate,
              nozzles: ea.nozzles,
              balance: ea.opening + ea.fuelIn - ea.cash,
            } as fuelBalanceDocument;
          }

          await addFuelBalance(obj);
        })
      );
    }

    await calcFuelBalance(
      { stationId:result.stationDetailId ,fuelType: result.fuelType, createAt: result.dailyReportDate },
      { liter: result.saleLiter },
      result.nozzleNo
    );
    fMsg(res, "New DetailSale data was added", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const updateDetailSaleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let result = await updateDetailSale(req.query, req.body);
    fMsg(res, "updated DetailSale data", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const deleteDetailSaleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await deleteDetailSale(req.query);
    fMsg(res, "DetailSale data was deleted");
  } catch (e) {
    next(new Error(e));
  }
};

// export const detailSalePaginateHandler = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   let pageNo = Number(req.params.page);
//   try {
//     let result = await detailSalePaginate(pageNo);
//     fMsg(res, "all Product are here", result);
//   } catch (e: any) {
//     next(new Error(e.message));
//   }
// };

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
    let result = await getDetailSale(req.query);
    fMsg(res, "DetailSale are here", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const addDetailSaleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let check = await getDetailSale({ vocono: req.body.vocono });
    //console.log(check);
    if (check.length != 0) {
      fMsg(res);
      return;
    }
    let result = await addDetailSale(req.body);
    let checkDate = await getFuelBalance({
      createAt: req.body.dailyReportDate,
    });
    if (checkDate.length == 0) {
      // console.log("wk");
      let prevDate = previous(new Date(req.body.dailyReportDate));
      let prevResult = await getFuelBalance({ createAt: prevDate });
      // console.log(prevResult);
      await Promise.all(
        prevResult.map(async (ea) => {
          let obj;
          if (ea.balance == 0) {
            obj = {
              stationId: "6464e9f1c45b82216ab1db6b",
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
              stationId: "6464e9f1c45b82216ab1db6b",
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
      { fuelType: result.fuelType, createAt: result.dailyReportDate },
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


export const detailSalePaginateHandler = async (req : Request , res : Response , next : NextFunction) =>{
  let pageNo = Number(req.params.page)
  try{
    let result = await detailSalePaginate(pageNo)
    fMsg(res , "all Product are here" , result)
  }catch (e : any){
    next(new Error(e.message))
  }
}
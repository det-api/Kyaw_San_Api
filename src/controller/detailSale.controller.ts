import { Request, Response, NextFunction, query } from "express";
import fMsg, { previous } from "../utils/helper";
import {
  getDetailSale,
  addDetailSale,
  updateDetailSale,
  deleteDetailSale,
  detailSalePaginate,
  detailSaleByDate,
  detailSaleByDateAndPagi,
  getLastDetailSale,
  // detailSaleByDate,
} from "../service/detailSale.service";
import {
  addFuelBalance,
  calcFuelBalance,
  getFuelBalance,
} from "../service/fuelBalance.service";
import { fuelBalanceDocument } from "../model/fuelBalance.model";
import { addDailyReport, getDailyReport } from "../service/dailyReport.service";
import {
  getCoustomerById,
  updateCoustomer,
} from "../service/coustomer.service";
import { addDebt } from "../service/debt.service";
import { getStationDetail } from "../service/stationDetail.service";

export const getDetailSaleHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let pageNo = Number(req.params.page);
    let { data, count } = await detailSalePaginate(pageNo, req.query);
    fMsg(res, "DetailSale are here", data, count);
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
    // //that is remove after pos updated

    let result = await addDetailSale(req.body);

    // if (result.cashType == "Debt") {
    //   // let checkVocono = await getDebt({ vocono: result.vocono });
    //   // if (checkVocono.length > 0)
    //   //   throw new Error("this vocono is alreadly exist");

    //   let coustomerConditon = await getCoustomerById(result.couObjId);

    //   if (!coustomerConditon)
    //     throw new Error("There is no coustomer with that name");

    //   let debtBody = {
    //     stationDetailId: result.stationDetailId,
    //     vocono: result.vocono,
    //     couObjId: result.couObjId,
    //     deposit: 0,
    //     credit: result.totalPrice,
    //     liter: result.saleLiter,
    //   };

    //   coustomerConditon.cou_debt =
    //     coustomerConditon.cou_debt + result.totalPrice;

    //   await addDebt(debtBody);

    //   await updateCoustomer(result.couObjId, coustomerConditon);
    // }

    let checkDate = await getFuelBalance({
      stationId: req.body.stationDetailId,
      createAt: req.body.dailyReportDate,
    });

    let checkRpDate = await getDailyReport({
      stationId: result.stationDetailId,
      dateOfDay: result.dailyReportDate,
    });

    if (checkRpDate.length == 0) {
      await addDailyReport({
        stationId: result.stationDetailId,
        dateOfDay: result.dailyReportDate,
      });
    }

    if (checkDate.length == 0) {
      let prevDate = previous(new Date(req.body.dailyReportDate));
      let prevResult = await getFuelBalance({
        stationId: req.body.stationDetailId,
        createAt: prevDate,
      });
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
      {
        stationId: result.stationDetailId,
        fuelType: result.fuelType,
        createAt: result.dailyReportDate,
      },
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

//get detail sale between two date

export const getDetailSaleByDateHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sDate: any = req.query.sDate;
    let eDate: any = req.query.eDate;

    delete req.query.sDate;
    delete req.query.eDate;

    let query = req.query;

    if (!sDate) {
      throw new Error("you need date");
    }
    if (!eDate) {
      eDate = new Date();
    }
    //if date error ? you should use split with T or be sure detail Id
    const startDate: Date = new Date(sDate);
    const endDate: Date = new Date(eDate);
    let result = await detailSaleByDate(query, startDate, endDate);
    fMsg(res, "detail sale between two date", result);
  } catch (e) {
    next(new Error(e));
  }
};

export const getDetailSaleDatePagiHandler = async (
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

    if (!sDate) {
      throw new Error("you need date");
    }
    if (!eDate) {
      eDate = new Date();
    }
    //if date error ? you should use split with T or be sure detail Id
    const startDate: Date = new Date(sDate);
    const endDate: Date = new Date(eDate);
    let { data, count } = await detailSaleByDateAndPagi(
      query,
      startDate,
      endDate,
      pageNo
    );

    fMsg(res, "detail sale between two date", data, count);
  } catch (e) {
    next(new Error(e));
  }
};

export const statementReportHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let sDate: any = req.query.sDate;
    let eDate: any = req.query.eDate;

    delete req.query.sDate;
    delete req.query.eDate;

    let query = req.query;

    if (!req.query.stationDetailId) throw new Error("you need stataion");
    if (!sDate) throw new Error("you need date");
    if (!eDate) eDate = new Date();

    const startDate: Date = new Date(sDate);
    const endDate: Date = new Date(eDate);

    let stationDetail = await getStationDetail({
      _id: req.query.stationDetailId,
    });

    let finalData: any = [];

    for (let i: number = 1; i <= stationDetail[0].nozzleCount; i++) {
      let noz = i.toString().padStart(2, "0");

      console.log(noz);

      query = {
        ...query,
        nozzleNo: noz,
      };

      let result = await detailSaleByDate(query, startDate, endDate);

      let count = result.length;
      console.log(count);

      if (count == 0) {
        let lastData = await getLastDetailSale(noz);

        let data = {
          stationId: stationDetail[0].name,
          nozzle: noz,
          price: lastData?.salePrice,
          totalizer_opening: Number(lastData?.totalizer_liter.toFixed(3)),
          totalizer_closing: Number(lastData?.totalizer_liter.toFixed(3)),
          totalizer_different: 0,
          totalSaleLiter: 0,
          totalSalePrice: 0,
        };

        finalData.push(data);

        // return;
      } else {
        let totalSaleLiter: number = result
          .map((ea) => ea["saleLiter"])
          .reduce((pv: number, cv: number): number => pv + cv, 0);

        let totalSalePrice: number = result
          .map((ea) => ea["totalPrice"])
          .reduce((pv: number, cv: number): number => pv + cv, 0);

        // console.log(
        //   result[0].totalizer_liter,
        //   result[count - 1].totalizer_liter,
        //   result[count - 1].salePrice
        // );

        let data = {
          stationId: stationDetail[0].name,
          nozzle: noz,
          price: result[count - 1].salePrice,
          totalizer_opening: Number(result[0].totalizer_liter.toFixed(3)),
          totalizer_closing: Number(
            result[count - 1].totalizer_liter.toFixed(3)
          ),
          totalizer_different: Number(
            result[0].totalizer_liter - result[count - 1].totalizer_liter
          ).toFixed(3),
          totalSaleLiter: Number(totalSaleLiter.toFixed(3)),
          totalSalePrice: Number(totalSalePrice.toFixed(3)),
        };
        finalData.push(data);
      }
    }

    console.log(finalData);
    fMsg(res, "final data", finalData);
  } catch (e) {
    console.log(e);
  }
};

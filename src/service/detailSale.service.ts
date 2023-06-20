import { FilterQuery, UpdateQuery } from "mongoose";
import detailSaleModel, { detailSaleDocument } from "../model/detailSale.model";
import config from "config";

const limitNo = config.get<number>("page_limit");

export const getDetailSale = async (query: FilterQuery<detailSaleDocument>) => {
  try {
    return await detailSaleModel
      .find(query)

      .populate("stationDetailId")
      .select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const addDetailSale = async (body: detailSaleDocument) => {
  try {
    return await new detailSaleModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const updateDetailSale = async (
  query: FilterQuery<detailSaleDocument>,
  body: UpdateQuery<detailSaleDocument>
) => {
  try {
    await detailSaleModel.updateMany(query, body);
    return await detailSaleModel.find(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteDetailSale = async (
  query: FilterQuery<detailSaleDocument>
) => {
  try {
    let DetailSale = await detailSaleModel.find(query);
    if (!DetailSale) {
      throw new Error("No DetailSale with that id");
    }
    return await detailSaleModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const getDetailSaleByFuelType = async (
  dateOfDay: string,
  // stationId : string,
  fuelType: string
) => {
  // console.log(dateOfDay);
  let fuel = await getDetailSale({
    dailyReportDate: dateOfDay,
    fuelType: fuelType,
  });

  let fuelLiter = fuel
    .map((ea) => ea["saleLiter"])
    .reduce((pv: number, cv: number): number => pv + cv, 0);
  let fuelAmount = fuel
    .map((ea) => ea["totalPrice"])
    .reduce((pv: number, cv: number): number => pv + cv, 0);

  return { count: fuel.length, liter: fuelLiter, price: fuelAmount };
};

export const detailSalePaginate = async (
  pageNo: number,
  query: FilterQuery<detailSaleDocument>
) => {
  const reqPage = pageNo == 1 ? 0 : pageNo - 1;
  const skipCount = limitNo * reqPage;
  return await detailSaleModel
    .find(query)
    .sort({ createAt: -1 })
    .skip(skipCount)
    .limit(limitNo)

    .populate("stationDetailId")
    .select("-__v");
};

export const detailSaleCount = async () => {
  return await detailSaleModel.count();
};
// that is testing

// export const detailSaleByDate = async (sDate, eDate) => {
//   console.log(new Date(sDate), new Date(eDate));
//   let result = await detailSaleModel.find({
//     createAt: { $gt: new Date(sDate), $lt: new Date(eDate) },
//   });
//   console.log(result);
// };

export const detailSaleByDate = async (
  query: FilterQuery<detailSaleDocument>,
  d1: Date,
  d2: Date
): Promise<detailSaleDocument[]> => {
  const filter: FilterQuery<detailSaleDocument> = {
    ...query,
    createAt: {
      $gt: d1,
      $lt: d2,
    },
  };

  let result = await detailSaleModel
    .find(filter)
    .sort({ createAt: -1 })
    .populate("stationDetailId")
    .select("-__v");

  return result;
};

// export const detailSaleByDateAndPagi = async (
//   query: FilterQuery<detailSaleDocument>,
//   d1: Date,
//   d2: Date,
//   pageNo: number
// ): Promise<{ count: number; data: detailSaleDocument[] }> => {
// const limitNo = config.get<number>("page_limit");

//   const reqPage = pageNo == 1 ? 0 : pageNo - 1;
//   const skipCount = 50 * reqPage;

//   const filter: FilterQuery<detailSaleDocument> = {
//     ...query,
//     createAt: {
//       $gt: d1,
//       $lt: d2,
//     },
//   };

//   const [data, count] = await Promise.all([
//     detailSaleModel
//       .find(filter)
//       .sort({ createAt: -1 })
//       .skip(skipCount)
//       .limit(50)
//
//       // .populate("stationDetailId")
//       .select("-__v"),

//     detailSaleModel.countDocuments(filter),
//   ]);

//   console.log(data);

//   return { data, count };
// };

export const detailSaleByDateAndPagi = async (
  query: FilterQuery<detailSaleDocument>,
  d1: Date,
  d2: Date,
  pageNo: number
): Promise<{ count: number; data: detailSaleDocument[] }> => {
  try {
    const reqPage = pageNo == 1 ? 0 : pageNo - 1;
    const skipCount = limitNo * reqPage;
    // console.log(reqPage , skipCount)
    const filter: FilterQuery<detailSaleDocument> = {
      ...query,
      createAt: {
        $gt: d1,
        $lt: d2,
      },
    };

    const dataQuery = detailSaleModel
      .find(filter)
      .sort({ createAt: -1 })
      .skip(skipCount)
      .limit(limitNo)
      .populate("stationDetailId")
      .select("-__v");

    const countQuery = detailSaleModel.countDocuments(filter);

    const [data, count] = await Promise.all([dataQuery, countQuery]);

    return { data, count };
  } catch (error) {
    console.error("Error in detailSaleByDateAndPagi:", error);
    throw error;
  }
};

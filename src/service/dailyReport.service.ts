import { FilterQuery, UpdateQuery } from "mongoose";
import dailyReportModel, {
  dailyReportDocument,
} from "../model/dailyReport.model";
import config from "config";

export const getDailyReport = async (
  query: FilterQuery<dailyReportDocument>
) => {
  try {
    return await dailyReportModel
      .find(query)
      .lean()
      .populate("stationId")
      .select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const addDailyReport = async (body: dailyReportDocument | {}) => {
  try {
    console.log("create one");
    return await new dailyReportModel(body).save();
  } catch (e) {
    // console.log("e")
    throw new Error(e);
  }
};

export const updateDailyReport = async (
  query: FilterQuery<dailyReportDocument>,
  body: UpdateQuery<dailyReportDocument>
) => {
  try {
    await dailyReportModel.updateMany(query, body);
    return await dailyReportModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteDailyReport = async (
  query: FilterQuery<dailyReportDocument>
) => {
  try {
    let DailyReport = await dailyReportModel.find(query);
    if (!DailyReport) {
      throw new Error("No DailyReport with that id");
    }
    return await dailyReportModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const getDailyReportByDate = async (
  d1: any,
  d2: any
): Promise<dailyReportDocument[]> => {
  let result = await dailyReportModel.find({
    date: { $gte: `${d1}T00:00:00Z`, $lte: `${d2}T23:59:59Z` },
  });
  return result;
};

export const dailyReportPaginate = async (
  pageNo: number,
  query: FilterQuery<dailyReportDocument>
) => {
  const limitNo = config.get<number>("page_limit");
  const reqPage = pageNo == 1 ? 0 : pageNo - 1;
  const skipCount = limitNo * reqPage;
  return await dailyReportModel
    .find(query)
    .skip(skipCount)
    .limit(limitNo)
    .lean()
    .populate("stationId")
    .select("-__v");
};

export const dailyReportCount = async () => {
  return await dailyReportModel.count();
};

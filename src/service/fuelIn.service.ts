import { FilterQuery, UpdateQuery } from "mongoose";
import fuelInModel, { fuelInDocument } from "../model/fuelIn.model";
import { getFuelBalance, updateFuelBalance } from "./fuelBalance.service";
import config from "config";

export const getFuelIn = async (query: FilterQuery<fuelInDocument>) => {
  try {
    return await fuelInModel
      .find(query)
      .lean()
      .populate("stationId")
      .select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const fuelInPaginate = async (
  pageNo: number,
  query: FilterQuery<fuelInDocument>
) => {
  const limitNo = config.get<number>("page_limit");
  const reqPage = pageNo == 1 ? 0 : pageNo - 1;
  const skipCount = limitNo * reqPage;
  return await fuelInModel
    .find(query)
    .sort({ createAt: -1 })
    .skip(skipCount)
    .limit(limitNo)
    .lean()
    .populate("stationId")
    .select("-__v");
};

export const addFuelIn = async (body: fuelInDocument) => {
  try {
    let no = await fuelInModel.count();
    let tankCondition = await getFuelBalance({
      fuelType: body.fuel_type,
      tankNo: body.tankNo,
      createAt: body.receive_date,
    });
    // console.log(tankCondition)

    const updatedBody = {
      ...body,
      fuel_in_code: no + 1,
      tank_balance: tankCondition[0].balance,
    };
    let result = await new fuelInModel(updatedBody).save();
    await updateFuelBalance(
      { _id: tankCondition[0]._id },
      { fuelIn: body.recive_balance }
    );
    return result;
  } catch (e) {
    throw new Error(e);
  }
};

export const updateFuelIn = async (
  query: FilterQuery<fuelInDocument>,
  body: UpdateQuery<fuelInDocument>
) => {
  try {
    await fuelInModel.updateMany(query, body);
    return await fuelInModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteFuelIn = async (query: FilterQuery<fuelInDocument>) => {
  try {
    let FuelIn = await fuelInModel.find(query);
    if (!FuelIn) {
      throw new Error("No FuelIn with that id");
    }
    return await fuelInModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const fuelInCount = async () => {
  return await fuelInModel.count();
};


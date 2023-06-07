import { FilterQuery, UpdateQuery } from "mongoose";
import fuelBalanceModel, {
  fuelBalanceDocument,
} from "../model/fuelBalance.model";

export const getFuelBalance = async (
  query: FilterQuery<fuelBalanceDocument>
) => {
  try {
    return await fuelBalanceModel
      .find(query)
      .lean()
      .populate("stationId")
      .select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const addFuelBalance = async (body: fuelBalanceDocument) => {
  try {
    return await new fuelBalanceModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const updateFuelBalance = async (
  query: FilterQuery<fuelBalanceDocument>,
  body: UpdateQuery<fuelBalanceDocument>
) => {
  try {
    await fuelBalanceModel.updateMany(query, body);
    return await fuelBalanceModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteFuelBalance = async (
  query: FilterQuery<fuelBalanceDocument>
) => {
  try {
    let fuelBalance = await fuelBalanceModel.find(query);
    if (!fuelBalance) {
      throw new Error("No fuelBalance with that id");
    }

    return await fuelBalanceModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const calcFuelBalance = async (query, body, payload: number) => {
  try {

    let result = await fuelBalanceModel.find(query);
    if (result.length == 0) {
      throw new Error("not work");
    }
    let gg = result.find(
      (ea: { nozzles: string[] }) =>
        ea["nozzles"].includes(payload.toString()) == true
    );
    if(!gg){
      throw new Error('no tank with that nozzle')
    }
    let cashLiter = gg?.cash + body.liter;

    let obj = {
      cash: cashLiter,
      balance: gg.opening + gg.fuelIn - cashLiter,
    };

    await fuelBalanceModel.updateMany({ _id: gg?._id }, obj);
    return await fuelBalanceModel.find({ _id: gg?._id }).lean();
  } catch (e) {
    throw new Error(e);
  }
};

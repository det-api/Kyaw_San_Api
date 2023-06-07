import { FilterQuery, UpdateQuery } from "mongoose";
import stationDetailModel , {stationDetailDocument} from "../model/stationDetail.model";

export const getStationDetail= async (query: FilterQuery<stationDetailDocument>) => {
  try {
    return await stationDetailModel.find(query).lean().select("-__v");
  } catch (e) {
    throw new Error(e);
  }
};

export const addStationDetail= async (body: stationDetailDocument) => {
  try {
    return await new stationDetailModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const updateStationDetail= async (
  query: FilterQuery<stationDetailDocument>,
  body: UpdateQuery<stationDetailDocument>
) => {
  try {
    await stationDetailModel.updateMany(query, body);
    return await stationDetailModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteStationDetail= async (query: FilterQuery<stationDetailDocument>) => {
  try {
    let StationDetail= await stationDetailModel.find(query);
    if (!StationDetail) {
      throw new Error("No StationDetail with that id");
    }
    return await stationDetailModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

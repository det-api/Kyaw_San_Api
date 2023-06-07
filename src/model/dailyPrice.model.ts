import mongoose, { Schema } from "mongoose";
import { stationDetailDocument } from "./stationDetail.model";

export interface dailyPriceDocument extends mongoose.Document {
  92: number;
  95: number;
  HSD: number;
  PHSD: number;
  date: Date;
  stationId: stationDetailDocument["_id"];
}

const dailyPriceSchema = new Schema({
  92: { type: Number, required: true },
  95: { type: Number, required: true },
  HSD: { type: Number, required: true },
  PHSD: { type: Number, required: true },
  date: {
    type: Date,
    default: new Date(),
    get: function (val) {
      return val.toLocaleString("en-US");
    },
    set: function (val) {
      return new Date(val);
    },
    unique: true,
  },
  stationId: { type: Schema.Types.ObjectId, required: true },
});

const dailyPriceModel = mongoose.model<dailyPriceDocument>(
  "dailyPrice",
  dailyPriceSchema
);
export default dailyPriceModel;

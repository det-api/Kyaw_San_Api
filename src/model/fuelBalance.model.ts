import mongoose, { Schema } from "mongoose";
import moment, { MomentTimezone } from "moment-timezone";

export interface fuelBalanceDocument extends mongoose.Document {
  stationId: string;
  fuelType: string;
  capacity: string;
  opening: number;
  fuelIn: number;
  tankNo: number;
  cash: number;
  credit: number;
  balance: number;
  createAt: string;
  nozzles: [];
}

const fuelBalanceSchema = new Schema({
  stationId: {
    type: Schema.Types.ObjectId,
    ref: "stationDetail",
    default: "6449f5a9a1808c9679bbed27",
  },
  fuelType: { type: String, required: true },
  capacity: { type: String, required: true },
  opening: { type: Number, default: 0 },
  tankNo: { type: Number, require: true },
  fuelIn: { type: Number, default: 0 },
  cash: { type: Number, default: 0 },
  // credit: { type: Number, default: 0 },
  balance: { type: Number, default: 0 },
  nozzles: { type: Array, require: true },
  dateOfDay: { type: String, default: new Date() },
  createAt: { type: Date, default: new Date().toLocaleDateString(`fr-CA`) },
});

fuelBalanceSchema.pre("save", function (next) {
  const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");
  // console.log(this.createAt);
  if (this.createAt) {
    next();
    return;
  }
  console.log(this.dateOfDay, currentDate);
  this.dateOfDay = currentDate;
  next();
});

const fuelBalanceModel = mongoose.model<fuelBalanceDocument>(
  "fuelBalance",
  fuelBalanceSchema
);

export default fuelBalanceModel;

import mongoose from "mongoose";
import { Schema } from "mongoose";
import moment, { MomentTimezone } from "moment-timezone";

export interface fuelInDocument extends mongoose.Document {
  stationId: string;
  driver: string;
  tankNo: string;
  bowser: string;
  fuel_type: string;
  fuel_in_code: number;
  tank_balance: number;
  recive_balance: number;
  receive_date: string;
}

const fuelInSchema = new Schema({
  stationId: {
    type: Schema.Types.ObjectId,
    ref: "stationDetail",
    require: true,
  },
  driver: { type: String, required: true },
  bowser: { type: String, required: true },
  tankNo: { type: String, required: true },
  fuel_type: { type: String, required: true },
  fuel_in_code: { type: Number, required: true },
  tank_balance: { type: Number, required: true },
  recive_balance: { type: Number, required: true },
  receive_date: { type: String, default: new Date() },
  createAt: { type: Date, default: new Date() },
});

fuelInSchema.pre("save", function (next) {
  const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");

  const options = { timeZone: "Asia/Yangon", hour12: false };

  let currentDateTime = new Date().toLocaleTimeString("en-US", options);

  const [hour, minute, second] = currentDateTime.split(":").map(Number);

  if (hour == 24) {
    currentDateTime = `00:${minute}:${second}`;
  }

  let iso: Date = new Date(`${currentDate}T${currentDateTime}.000Z`);
  this.receive_date = currentDate;
  this.createAt = iso;
  next();
});

const fuelInModel = mongoose.model<fuelInDocument>("fuelIn", fuelInSchema);

export default fuelInModel;

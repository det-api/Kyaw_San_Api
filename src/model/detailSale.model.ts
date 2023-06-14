import mongoose, { Schema } from "mongoose";
import { getDailyReportByDate } from "../service/dailyReport.service";
import moment from "moment-timezone";

export interface detailSaleDocument extends mongoose.Document {
  stationDetailId: string;
  dailyReportDate: string;
  vocono: string;
  carNo: string;
  vehicleType: string;
  nozzleNo: number;
  fuelType: string;
  salePrice: number;
  saleLiter: number;
  totalPrice: number;
  totalizer_liter: number;
  createAt: Date;
}

const detailSaleSchema = new Schema({
  stationDetailId: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "stationDetail",
  },
  vocono: { type: String, required: true, unique: true },
  carNo: { type: String, default: null }, //manual
  vehicleType: { type: String, default: "car" }, //manual
  nozzleNo: { type: Number, required: true },
  fuelType: { type: String, required: true },
  salePrice: { type: Number, required: true },
  saleLiter: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  totalizer_liter: { type: Number, required: true },
  totalizer_amount: { type: Number, required: true },
  dailyReportDate: {
    type: String,
    default: new Date().toLocaleDateString(`fr-CA`),
  },
  createAt: { type: Date, default: new Date() },
});

detailSaleSchema.pre("save", function (next) {
  if (this.fuelType == "001-Octane Ron(92)" && this.salePrice < 5000) {
    this.vehicleType = "Cycle";
  }

  const currentDate = moment().tz("Asia/Yangon").format("YYYY-MM-DD");
  if (this.dailyReportDate) {
    next();
    return;
  }
  this.dailyReportDate = currentDate;
  next();
});
const detailSaleModel = mongoose.model<detailSaleDocument>(
  "detailSale",
  detailSaleSchema
);

export default detailSaleModel;

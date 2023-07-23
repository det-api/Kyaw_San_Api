import mongoose, { Schema } from "mongoose";

export interface checkStationDocument extends mongoose.Document {
  otpCode: string;
  stationId: string;
}

const checkStationSchema = new Schema({
  otpCode: { type: String, unique: true, required: true },
  stationId: {
    type: Schema.Types.ObjectId,
    ref: "stationDetail",
    require: true,
  },
  createdAt: { type: Date, default: Date.now() },
});

const checkStationModel = mongoose.model<checkStationDocument>(
  "checkStation",
  checkStationSchema
);

export default checkStationModel;

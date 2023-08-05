import mongoose, { Schema } from "mongoose";

export interface tempDocument extends mongoose.Document {
  email: string;
  password: string;
}

const tempSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const tempModel = mongoose.model<tempDocument>("temp", tempSchema);

export default tempModel;

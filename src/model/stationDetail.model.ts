import mongoose , {Schema} from "mongoose";

export interface stationDetailDocument extends mongoose.Document{
    name : string;
    location : string;
    lienseNo : string
}

const stationDetailSchema =  new Schema({
    name : {type: String, required: true},
    location : {type: String, required: true , unique : true},
    lienseNo : {type: String, required: true , unique : true}
})

const stationDetailModel = mongoose.model<stationDetailDocument>('stationDetail' , stationDetailSchema)

export default stationDetailModel
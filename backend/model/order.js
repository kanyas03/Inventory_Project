import { Schema } from "mongoose";
import { model } from "mongoose";

const inventory =new Schema({
     p_Id:{type:String,required:true,unique:true},
     p_Name:{type:String,required:true},
     p_quantity:{type:String,required:true},
     userId: { type: Schema.Types.ObjectId, ref: "user", required: true }, 
     orderDate: { type: Date, default: Date.now },
     status: { type: String, enum: ['pending', 'processing', 'delivered', 'canceled'], default: 'pending' },
})
const placeorder = model('order',inventory)
export {placeorder}
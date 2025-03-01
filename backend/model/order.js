import { Schema } from "mongoose";
import { model } from "mongoose";

const inventory =new Schema({
     p_Id:{type:String,required:true},
     p_Name:{type:String,required:true},
     p_quantity:{type:Number,required:true},
     userId: { type: Schema.Types.ObjectId, ref: "user", required: true }, 
     orderDate: { type: Date, default: Date.now },
    
})
const placeorder = model('order',inventory)
export {placeorder}
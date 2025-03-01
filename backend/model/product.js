import { Schema } from "mongoose";
import { model } from "mongoose";

const Product =new Schema({
     Product_Name:{type:String,required:true},
     Product_category:{type:String,required:true},
     Product_quantity:{type:String,required:true},
     image: {type:String}
    
})
const viewProduct = model('admin',Product)
export {viewProduct}
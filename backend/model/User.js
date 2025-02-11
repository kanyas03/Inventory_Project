import { Schema } from "mongoose";
import { model } from "mongoose";


const Signup =new Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    userName:{type:String,required:true,unique:true},
    dept:{type:String,required:true},
    Ph:{type:Number,required:true},
    password:{type:String,required:true},
    userRole:{type:String,required:true}
})
const user = model('user',Signup)
export {user}
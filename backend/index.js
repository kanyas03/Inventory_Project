import express,{json}  from 'express';
import dotenv from 'dotenv';
import { userauth } from './Routes/userauth.js';
import { adminauth } from './Routes/adminauth.js';
import mongoose from 'mongoose';

dotenv.config();
const app =express();
app.use(json()) 
app.use('/',userauth);
app.use('/',adminauth);


mongoose.connect('mongodb://localhost:27017/INVENTORY').then(()=>{
    console.log("Mongodb connected Successfully to Inventory Project");})
    .catch((error)=>{
        console.error("Mongodb connection failed",error);
});
app.listen(process.env.PORT,function(){
    console.log(`server is listening at ${process.env.PORT}`);
    
});
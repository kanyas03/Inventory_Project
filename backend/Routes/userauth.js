import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken'
import { user } from "../model/User.js";
import authenticate from "../middleware/auth.js";
import usercheck from "../middleware/usercheck.js";
import {placeorder} from "../model/order.js";



const userauth=Router();
userauth.post('/signup',async(req,res)=>{
    try{
        const{FirstName,LastName,UserName,password,Department,PhoneNumber,UserRole}=req.body;
        const existingUser = await user.findOne({userName:UserName});
        if(existingUser)
        {
            res.status(400).send("This user name Already exists") //send a respons to the user status is a status code 400 means bad request
        }    
        else{
        
            const newpassword=await bcrypt.hash(password,10)
            const newUser = new user({
            firstName: FirstName,
            lastName : LastName,
            userName : UserName,
            dept:Department,
            Ph:PhoneNumber,
            password: newpassword,
            userRole: UserRole
        })
        await newUser.save();
        res.status(201).send("Sign up successfully")
    }
    }
    catch{
        res.status(500).send("Internal Server Error")

    }
})



userauth.post('/login',async(req,res)=>{
    try{
        const{UserName,password}=req.body;
        const result= await user.findOne({userName:UserName});
        if(!result){
            res.status(400).send("Invaild User name");
        }
        else
        {  
            console.log(result.password);
          
            const valid=await bcrypt.compare(password,result.password);
            
            console.log(valid);
            if(valid){
                const token= jwt.sign({ _id:result._id,userName:UserName,userRole:result.userRole},process.env.SECRET_KEY,{expiresIn:'2hr'});
                console.log(token);
                
                
                res.cookie('inventoryAuth',token,
                {
                    httpOnly:true

                });
                
                res.status(200).send("logged in successfuly");
                console.log(`${UserName},`)
                console.log(result.userRole)
            }
            else{
                res.status(401).send("Unauthorized Access");
            }
        }
    }
    catch{
        res.status(500).send("Internal Server Error")

    }
})




userauth.get('/viewProfile',authenticate,usercheck,async(req,res)=>{
    try{
    const name =req.query.UserName;
    const Details =await user.findOne({userName:name});
    console.log(Details);
        if(Details){
            res.status(200).json({Details})
        }
        else{
            res.status(404).json({msg:'no profile'})
        }
    }catch{
        res.status(500).send("Internal server Error")
    }

})



userauth.post('/placeorder', authenticate, usercheck, async (req, res) => {
    try {
      const { ProductName, ProductId, Quantity } = req.body;

      const userId = await user.findOne(req._id) ; // Assuming the user's ID is available after authentication
      console.log(userId);
  
      // Check if the product already exists in the order
      const existingOrder = await placeorder.findOne({ p_Id: ProductId });
      if (existingOrder) {
        return res.status(400).send("Order already exists");
      }
  
      // Create a new order and associate the userId
      const newOrder = new placeorder({
        p_Id: ProductId,
        p_Name: ProductName,
        p_quantity: Quantity,
        userId: userId // Link the user who placed the order
      });
      await newOrder.save();
      res.status(201).send("Order added");
      console.log(newOrder);
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).send("Internal Server Error");
    } 
  });
  


  userauth.delete('/deleteOrder',authenticate,usercheck,async(req,res)=>{
    try{
        const {ProductId}=req.body;
        const result = await addProduct.findOne({p_Id:ProductId})
        if(result){
            await addProduct.findOneAndDelete(ProductId);
            res.status(200).send("Product Successfully deleted")

        }else{
            res.status(404).send("product not found")
        }
    }
    catch{
        res.status(500).send("Server Error")
    }
})



userauth.get('/logout',(req,res)=>{
    res.clearCookie('inventoryAuth');
    res.status(200).send("successfuly logout")
})


export{userauth}
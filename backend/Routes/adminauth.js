import { Router } from "express";
import  authenticate  from "../middleware/auth.js";
import admincheck from "../middleware/admincheck.js";
import { addProduct } from "../model/addproduct.js";
import { placeorder } from "../model/order.js";
import upload from "../middleware/upload.js";
import { user } from "../model/User.js";

const adminauth=Router();

const convertToBase64 = (buffer) => {
    return buffer.toString("base64");
};

adminauth.get('/users', authenticate, admincheck, async (req, res) => {
    try {
        // Fetch all user details except passwords
        const users = await user.find({}, { password: 0 });

        if (!users.length) {
            return res.status(404).json({ message: "No users found" });
        }

        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});






adminauth.post('/addproduct',authenticate,admincheck,upload.single("Product_img"),async(req,res)=>{   //authentication is amiddleware
    try{    console.log("hii")
            const {ProductName,ProductId,Category,Quantity}= req.body;
            
            const existingProduct = await addProduct.findOne({p_Id:ProductId})
            if(existingProduct){
                res.status(400).send("Product already exist");
            }
            else{ 
                let imageBase64 =null;
                if(req.file){
                    imageBase64 =convertToBase64(req.file.buffer)
                }
                
                const newProduct = new addProduct({
                    p_Id:ProductId,
                    p_Name:ProductName,
                    p_category:Category,
                    p_quantity:Quantity,
                    image: imageBase64
                   
                })
                await newProduct.save();
                res.status(201).send("Product added")
                console.log(newProduct);
            }
        }
    catch{
        res.status(500).send("Internal Server Error")

    }
});





adminauth.get('/getProduct',async(req,res)=>{
    try{
        const Pname = req.query.P_Name;
        const result=await addProduct.find()
         if(result){
            console.log(result)
            res.status(200).json({data:result})
        }
        else{
        res.status(404).json({message:"Product not found"})
        }
    }
    catch{
        res.status(500).send("Internal Server Error")
    }
})


adminauth.put('/updateProduct',authenticate,admincheck,async(req,res)=>{
    try{
        const {ProductName,ProductId,Category,Quantity}= req.body;
           const result =await addProduct.findOne({p_Id:ProductId});
           console.log(result)
        
           if(result){
               result.p_Name=ProductName,
               result.p_Id=ProductId;
               result.p_category=Category;
               result.p_quantity=Quantity;
               console.log(result)

               await result.save();
               res.status(200).json({Msg:`Updated successfuly`})
           }
           else{
               res.status(403).json({msg:"you are not allowed to do this"})
           }
       }
       catch{
           res.status(500).send("server Error")
       }
})




adminauth.delete('/deleteProduct',authenticate,admincheck,async(req,res)=>{
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



adminauth.get('/orderdetails',authenticate, async (req, res) => {
    try {
      const { orderId } = req.query;
  
      if (!orderId) {
        return res.status(400).send("Order ID is required");
      }
  
      
      const order = await placeorder.findById(orderId);
  
      
      console.log(order);  
  
      if (!order) {
        return res.status(404).send("Order not found");
      }
  
      if (!order.userId) {
        return res.status(404).send("User associated with this order not found");
      }
  
      // Now, populate the userId reference
      await order.populate('userId', 'userId userName department phoneNumber');
  
      res.status(200).json({
        orderId: order._id,
        productName: order.p_Name,
        quantity: order.p_quantity,
        orderDate: order.orderDate,
        status: order.status,
        userDetails: {
          userId: order.userId.userId,
          userName: order.userId.userName,
          department: order.userId.department,
          phoneNumber: order.userId.phoneNumber,
        }
      });
    } catch (error) {
      console.error("Error occurred:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  
export {adminauth}
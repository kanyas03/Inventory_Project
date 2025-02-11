const adminCheck=(req,res,next)=>{
    if(req.userrole== "Admin"){
        next();
    }
    else{
      
        res.status(403).json({msg:"You are not allowed"})
        console.log("You are not allowed");
        
    }
}

export default adminCheck;
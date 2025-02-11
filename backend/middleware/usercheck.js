const usercheck=(req,res,next)=>{
    if(req.userrole== "User"){
        next();
    }
    else{
      
        res.status(403).json({msg:"You are not allowed"})
    }
}

export default usercheck;
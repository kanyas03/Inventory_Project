// import jwt from "jsonwebtoken";
// import dotenv from 'dotenv';

// dotenv.config()

// const authenticate =(req,res,next)=>{
//     const cookie = req.headers.cookie;
//     console.log(cookie);
//     const [name,token] = cookie.trim().split('=');
//     console.log(name)
//     console.log(token)
//     console.log("hi")

//     if(name=='inventoryAuth'){
//        const verified = jwt.verify(token,process.env.SECRET_KEY)
//        console.log(verified)
//        req.username = verified.userName;
//        req.userrole = verified.userRole;
//        console.log(req.userName);
//        console.log(req.userRole );
       
//        next();     //go to next function
//        //break;
//     }
//     else{
//         res.status(401).json({message:" Unauthorized"});
//     }
    
// }
// export default authenticate

import jwt from 'jsonwebtoken' 
import dotenv from 'dotenv';
 
dotenv.config();
const secretkey=process.env.SECRET_KEY


const authenticate=(req,res,next)=>{
   const cookies= req.headers.cookie;
    
    console.log(cookies)
    const cookie=cookies.split(';');
    if(!cookie){
        console.log("Cookie not found")
    }
    for(let cooki of cookie){    
        const [name,token]=cooki.trim().split('=')
        if(name=='inventoryAuth'){
            const verified= jwt.verify(token,secretkey)
            console.log(verified)
            console.log(verified.userName)
            console.log(verified.userRole)
            req.userId = verified.userId;
            req.username=verified.userName;
            req.userrole=verified.userRole;
            break;
        }
        }
        next();

    }

export default authenticate
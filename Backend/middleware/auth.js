const jwt = require('jsonwebtoken');
const User = require('../models/User');

//user verification middleware
const verifying = async (req,res,next) =>{

   const token = req.header('auth-token')
    
    if(!token){ 
        return res.status(401).send({error: "Please authenticate using a valid token."})
    }
    try{

    const data= jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(data.user.id).select("-password")

    if (!req.user) {
            return res.status(401).send({ error: "User not found." });
        }

    next()
    
    }
    catch(error){
         return res.status(401).send({error: "Please authenticate using a valid token."})
    }
}

const verifyingAdmin = async (req,res,next) =>{
    if(!req.user || req.user.role !== "admin"){
        return res.status(403).send({error: "Access denied. Admins only."})
    }
    next()
}

module.exports = { verifying, verifyingAdmin }
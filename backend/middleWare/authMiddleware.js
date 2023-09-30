const asyncHandler = require("express-async-handler");
const User = require("../models/usermodels");
const jwt = require ("jsonwebtoken");

const protect = asyncHandler(async(req, res, next) =>{
  try{
   const token = req.cookies.token
   if(!token){
    res.status(401)//unathorize user
    throw new Error("No autorizado, por favor accede a la plataforma")
   }

   //verify token
   const verified = jwt.verify(token, process.env.JWT_SECRET);
   
   //get user id from token
   const user = await User.findById(verified.id).select("-password") //no get password

   if (!user){
    res.status(401)
    throw new Error("Usuario no encontrado")
   }
   req.user = user
   next();

  }catch (error) {
    res.status(401)//unathorize user
    throw new Error("No autorizado, por favor accede a la plataforma")
  }
});

module.exports = protect;
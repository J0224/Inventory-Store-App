const asyncHandler = require("express-async-handler");
const User = require("../models/usermodels");
const jwt = require ("jsonwebtoken");
const bcrypt = require("bcryptjs");

//Thid is to generate json web token
const generateToken = (id) =>{
  return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
};

//This is an async fuction called registerUser to register users
const registerUser = asyncHandler( async (req, res) =>{
  const {name, email, password} = req.body

//This is the validation
if(!name || !email || !password){
  res.status(400)
  throw new Error("Por favor llena todos los campos requeridos")
} if(password.length < 6){
  res.status(400)
  throw new Error ("Contraseña debe contener al menos 6 caracteres")
} 

//Check if user email aready exist

const userExist = await User.findOne({email})

if (userExist){
  res.status(400)
  throw new Error ("El correo electronico ya ha sido utilizado")
}

// Create new user

const user = await User.create({
  name,
  email,
  password,
})

// This is for generating json web token
const token = generateToken(user._id)

// This is to send HTTP Only cookie
res.cookie("token", token, {
  path:"/",
  httpOnly: true,
  expires: new Date(Date.now() + 1000 * 86400), // one day
  sameSite: "none",
  secure: true
});

if (user){
  const {_id, name, email, photo, phone, bio } = user;
  res.status(201).json({
    _id, 
    name, 
    email, 
    photo, 
    phone, 
    bio,
    token,
  });
} else {
  res.status(400)
  throw new Error("Datos de usuario invalido")
}
}); //end of the async fuction called registerUser to register users


// This an async function loginUser to Log in User

const loginUser = asyncHandler( async (req, res) =>{

  const {email, password} = req.body

  //Validate request

  if(!email || !password){
    res.status(400)
    throw new Error("Por favor añade correo electronico y contraseña");
  }

  //Check if user exists
  const user = await User.findOne({email})

  if(!user){
    res.status(400);
    throw new Error("Usuario no encontrado, por favor crea una cuenta"); 
   }

   //If user exists check if password is correct

   const passwordIsCorrect = await bcrypt.compare(password, user.password)

   // This is for generating json web token
const token = generateToken(user._id)

// This is to send HTTP Only cookie
res.cookie("token", token, {
  path:"/",
  httpOnly: true,
  expires: new Date(Date.now() + 1000 * 86400), // one day
  sameSite: "none",
  secure: true
});



   if (user && passwordIsCorrect){
    const {_id, name, email, photo, phone, bio } = user;
  res.status(200).json({
    _id, 
    name, 
    email, 
    photo, 
    phone, 
    bio,
    token,
  });
   } else {
    res.status(400);
    throw new Error("Correo electronico o contraseña incorrecta"); 
   }

});

module.exports = {
  registerUser, 
  loginUser,
};
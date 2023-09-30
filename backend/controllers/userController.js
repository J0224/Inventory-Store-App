const asyncHandler = require("express-async-handler");
const User = require("../models/usermodels");
const jwt = require ("jsonwebtoken");
const bcrypt = require("bcryptjs");
const token = require ("../models/tokenModel");
const crypto = require ("crypto");

//This is to generate json web token
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


// This an async function called loginUser to Log in User

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


//This is an async function called logout to log user out

const logout = asyncHandler (async (req, res) =>{
  
  res.cookie("token", "", {
    path:"/",
    httpOnly: true,
    expires: new Date(0), // expire the cookie
    sameSite: "none",
    secure: true
  });
  return res.status(200).json({message: "Terminaste la seccion existosamente"})
});

//This is an async function called getUser to get users data

const getUser = asyncHandler (async (req, res) =>{ 
  const user = await User.findById(req.user._id)

 
if (user){
  const {_id, name, email, photo, phone, bio } = user;
  res.status(200).json({
    _id, 
    name, 
    email, 
    photo, 
    phone, 
    bio,
  });
} else {
  res.status(400)
  throw new Error("Usuario no fue encontrado")
}
});

//This is an async fuction called loginStatus to Get login status of the user
const loginStatus = asyncHandler (async (req, res) => {

 const token = req.cookies.token;
 if (!token){
  return res.json(false)
 } 
 //verify token
 const verified = jwt.verify(token, process.env.JWT_SECRET);
if (verified){
  return res.json(true);
}
return res.json(false);
});


//This is an async fuction called updateUser to update the user data
const updateUser = asyncHandler (async (req, res) =>{

const user = await User.findById(req.user._id);

if (user){
  const { name, email, photo, phone, bio } = user;
  user.email = email;
  user.name = req.body.name || name;
  user.photo = req.body.photo || photo;
  user.phone = req.body.phone || phone;
  user.bio = req.body.bio || bio;

const updatedUser = await user.save()
res.status(200).json({
  _id: updatedUser._id,
  name: updatedUser.name, 
  email: updatedUser.email, 
  photo: updatedUser.photo, 
  phone: updatedUser.phone, 
  bio: updatedUser.bio,
})
}
else {
  res.status(404)
  throw new Error ("Usuario no encontrado");
}
});

//This is an async fuction called changePassword to change the user password

const changePassword = asyncHandler (async (req, res) => {

  const user = await User.findById(req.user._id);

  const {oldPassword, password} = req.body
  if (!user){
    res.status(400)
    throw new Error ("Usuario no encontrado por favor crea una cuenta");
  }

  //This is the validation to change the password
  if (!oldPassword || !password){
    res.status(400)
    throw new Error ("Por favor añade la contraseña existente y la nueva contraseña");
  }

  //Check if old password is correct or matches in DB

  const passwordIsCorrect = await bcrypt.compare(oldPassword, user.password)

  //Save new password
  if (user && passwordIsCorrect){
    user.password = password
    await user.save()
    res.status(200).send("Contraseña cambiada existosamente")
} else {
  res.status(400)
    throw new Error ("Contraseña vieja no es correcta");
}

});

//This is an async fuction called forgotPassword to reset the user password

const forgotPassword = asyncHandler (async (req, res) => {

  const {email} = req.body
  const user = await User.findOne({email});
 
  if (!user){
    res.status(404)
    throw new Error("Usuario no existe")
  }

  //Create reset token
  let  resetToken = crypto.randomBytes(32).toString("hex") + user._id

  //Hash Token before saving to DB
  const hashedToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

console.log(hashedToken);

  res.send("Forgot Password");

});




module.exports = {
  registerUser, 
  loginUser,
  logout,
  getUser,
  loginStatus,
  updateUser,
  changePassword,
  forgotPassword
};
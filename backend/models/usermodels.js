const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
name:{
  type:String, 
  required:[true, 'Por favor añade un nombre']
},
email:{
  type:String, 
  required:[true, 'Por favor añade un correo electronico'],
  unique: true,
  trim: true,
  match:[
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    "Por favor entre un correo electronico valido"
  ]
},
password:{
  type:String, 
  required:[true, 'Por favor añade una contraseña'],
  minLength:[6, "Contraseña debe contener minimo 6 caracteres"],
  //maxLength:[23, "Contraseña no debe contener mas de 24 caracteres"]
},
photho:{
  type:String, 
  required:[true, 'Por favor añade una foto'],
  default:"https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg"

},
phone:{
  type:String, 
  default:"+1809"
},
bio:{
  type:String, 
  maxLength:[250, "Bio no puede contener mas de 250 caracteres"],
  default: "bio"
},

}, {
  timestamps: true,
});

//This is for encrypt password before saving it to DataBase

userSchema.pre("save", async function(next){
if(!this.isModified("password")){
  return next()

}

//This is for hashing the password
const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(this.password, salt);
this.password = hashedPassword;
next()
});

const User = mongoose.model('User',userSchema)

module.exports = User;
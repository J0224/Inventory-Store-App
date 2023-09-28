const dotenv = require("dotenv").config();

if (dotenv.error) {
  console.error("Error loading .env file:", dotenv.error);
}

const { MongoClient, ServerApiVersion } = require('mongodb');

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userRoute = require("./routes/userRote");
const errorHandler = require("./middleWare/errorMiddleWare");
const cookieParser = require("cookie-parser");

const app = express();

//Middlewares

app.use(express.json());
app.use(cookieParser);
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

//Routes middlewares

app.use("/api/users", userRoute);

//create routes

app.get("/", (req, res)=>{
  res.send("Home page")
})


// Use process.env.MONGO_URI to get the MongoDB Atlas URI from the .env file
const uri = process.env.MONGO_URI;

//Error MiddleWare
app.use(errorHandler);


// Connect to MongoDB and start the server
const PORT = process.env.PORT || 3500;

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

  
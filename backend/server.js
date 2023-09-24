const dotenv = require("dotenv").config();

if (dotenv.error) {
  console.error("Error loading .env file:", dotenv.error);
}

const { MongoClient, ServerApiVersion } = require('mongodb');

const express = require("express");
const mongoose = require("mongoose");
const bodyParser  = require("body-parser");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3500;

const uri = "mongodb+srv://josemiguelmateo2:<Eusebiomateo241992>@cluster0.bbz1mpn.mongodb.net/?retryWrites=true&w=majority";

//Connect to Mongodb start server
mongoose
.connect(process.env.MONGO_URI)
.then(()=>{
  app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`)
  })
})
.catch((err)=>{
  console.log(err)
});


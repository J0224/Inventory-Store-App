const dotenv = require("dotenv").config();

if (dotenv.error) {
  console.error("Error loading .env file:", dotenv.error);
}

const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3500;

// Use process.env.MONGO_URI to get the MongoDB Atlas URI from the .env file
const uri = process.env.MONGO_URI;

// Connect to MongoDB and start the server
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

  
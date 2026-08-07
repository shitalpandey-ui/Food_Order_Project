//msin configuration file that creates your application, loads middleware, and registers routes

// import express 
const express = require('express');

// create express application 
const app = express();
// import middleware packages

const cors = require("cors")
const bodyParser = require("body-parser")
const authRoutes = require("./routes/auth");
// user middleware 

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/api/user", authRoutes);

module.exports =app; 

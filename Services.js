const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const cors = require("cors")
require('dotenv').config()
var Request = require('tedious').Request


const studentRouter = require('./studentsSQL');
// const fileRoutes = require('./fileUploads.js');

const server = express();

server.use(cors())
server.use(bodyParser.json());

server.use('/students', studentRouter);
// server.use('/projects/files', fileRoutes);


// mongoose.connect("mongodb://localhost:27017/Students", {
//   useNewUrlParser: true
// }).then(server.listen(3000, () => {
//   console.log("Server running on port 3000");
// })).catch(err => console.log(err))

server.listen(3000, () => {
  console.log("Server running on port 3000")
})

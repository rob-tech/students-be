const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose")
const cors = require("cors")

const studentRoutes = require('./index.js');
const fileRoutes = require('./fileUploads.js');

const server = express();

server.use(cors())
server.use(bodyParser.json());

server.use('/students', studentRoutes);
server.use('/projects/files', fileRoutes);


mongoose.connect("mongodb://localhost:27017/Students", {
  useNewUrlParser: true
}).then(server.listen(3000, () => {
  console.log("Server running on port 3000");
})).catch(err => console.log(err))

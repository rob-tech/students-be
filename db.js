var Connection = require('tedious').Connection
var Request = require('tedious').Request
require('dotenv').config()

var config = {
    server: 'striverob.database.windows.net',
    authentication: {
        type: 'default',
        options: {
            userName: process.env.USER, // update me
            password: process.env.PASS // update me
        }
    },
    options: {
        database: 'Students'
    }
  }

var connection = new Connection(config)
connection.on('connect', err =>{
  if (err) console.log(err)
  else console.log("connected")
})

module.exports = connection;
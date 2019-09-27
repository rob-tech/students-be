const { Schema} = require("mongoose")
const mongoose = require("mongoose")
const validator = require("validator")

const studentSchema = new Schema({
    Name: {
        type: String,
        required: true
    },
    Surname: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email!!")
            }
        }
    },
    DOB: {
        type: String,
        required: true
    },
    Projects:  [{
    _id: {type: Schema.Types.ObjectId, auto: true},
    Name: String,
    Description: String,
    CreationDate: Date,
    repoURL: String,
    LiveURL: String
    }]
})

module.exports = mongoose.model('Student', studentSchema)
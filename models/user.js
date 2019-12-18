var mongoose = require('mongoose')
var validator = require('validator')

var users = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validate(user) {
            if (!validator.isEmail(user)) {
                throw new Error('invalid email')
            }
        }
    },
    phone: {
        type: String,
        required: true,
        maxlength: 10
    },
    gender:{
        type:String
    },
    password: {
        type: String,
        required: true
    }
})

var userModel = mongoose.model('userModel', users)

module.exports = userModel
const mongoose = require('mongoose')

const userSchema = mongoose.Schema({

    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: "please enter your email Id",
        unique: true,
        min: 10,
        max: 50

    },
    phone: {
        type: Number,
        required: 'please enter your phone number',
        min: 10,
    },
    password: {
        type: String,
        required: true,
        min: 3,
        max: 30
    },
    role: {
        type: String,
        enum: ['user', 'technician', 'manager', 'admin'],
        default: 'user'
    },
    area: {
        type: String,
        require: true
    },
    is_verified: {
        type: Boolean,
        default: false
    }
}, {
    timeStamp: true
})

module.exports = mongoose.model('User', userSchema)
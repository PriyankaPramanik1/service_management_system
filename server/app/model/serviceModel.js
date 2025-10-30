const mongoose = require('mongoose')

const serviceSchema = mongoose.Schema({
    serviceName: {
        type: String,
        require: true
    },
    serviceType: {
        type: [String],
        require: true
    },
    serviceHeader: {
        type: String,
        require: true
    },
    serviceDetails: {
        type: String,
        require: true
    },
    serviceImage: {
        type: String,
        require: true
    },
    serviceInclude: {
        type: [String],
        require: true
    }
})
module.exports = mongoose.model('service', serviceSchema)
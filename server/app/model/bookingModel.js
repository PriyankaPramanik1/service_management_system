const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    applianceType: {
        type: String,
        validate: {
            validator: function (v) {
                const allowedValues = ['AC', 'Fridge', 'TV', 'Washing Machine', 'Microwave', 'Air Cooler', 'Water Purifier', 'Geyser', 'CCTV'];
                return allowedValues.map(val => val.toLowerCase()).includes(v.trim().toLowerCase());
            },
            message: props => `${props.value} is not a valid appliance type`
        },
        required: true,
    },
    serviceType: {
        type: String,
        enum: ['Repair', 'Installation', 'Maintenance', 'Emergency Repair'],
        require: true
    },

    preferredDate: {
        type: Date,
        required: true,
    },
    bookingImage: {
        type: String,
        required: true,
    },
    problemDescription: {
        type: String,
        require: true
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'completed', 'cancel', 'in progress'],
        default: 'pending',
    },


    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // technician
        default: null,
    },
    assignedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // manager or admin
        default: null,
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Booking', bookingSchema)

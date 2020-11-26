
const mongoose = require('mongoose');

const data = mongoose.model('reservations',{
    userId: {
        type: String,
        required: true
    },
    doctorId: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        default: 0,
    },
    rate: {
        type: Number,
        default: null
    },
    services:{
        type: Array,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    AWT: {
        type: Number,
        default: null
    },
});

module.exports = data;

const mongoose = require('mongoose');

const data = mongoose.model('doctors',{
    image: {
        type: String,
        default: null
    },
    availabe_dayes: {
        type: Array,
        default: []
    },
    name: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        default: null
    },
    password:{
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        default: null,
    },
    lat: {
        type: String,
        default: null
    },
    lng: {
        type: String,
        default: null
    },
    services:{
        type: Array,
        required: true
    },
});

module.exports = data;
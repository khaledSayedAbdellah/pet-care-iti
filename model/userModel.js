
const mongoose = require('mongoose');

const data = mongoose.model('users',{
    image: {
        type: String,
        default: null
    },
    name: {
        type: String,
        required: true
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
});

module.exports = data;
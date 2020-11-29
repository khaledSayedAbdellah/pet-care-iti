
const mongoose = require('mongoose');

const data = mongoose.model('doctor_services',{
    title: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: "https://cornerstonechurch.asn.au/wp-content/uploads/2015/07/default-placeholder-1024x1024.png",
    }
    
});

module.exports = data;
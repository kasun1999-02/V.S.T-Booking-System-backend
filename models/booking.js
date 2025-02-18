const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({

    fullname: {
        type: String, required: true
    },
    email : {
        type: String, required: true
    },
    phonenumber : {
        type: int, required: true
    },
    fromdate : {
        type: String, required: true
    },
    vehicaltype : {
        type: String, required: true
    },
    vehicalenumber: {
        type: string, required: true
    },
    selectservice : {
        type: String, required: true
    },
    branch: {
        type: String, required: true  
    },
    comment: {
        type: String, required: true
    },



}, {
    timestamps : true,
})

const bookingmodel = mongoose.model('bookings' , bookingSchema);

module.exports = bookingmodel
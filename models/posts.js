const mongoose = require("mongoose");

const postSchema = mongoose.Schema({

    fullname: {
        type: String, required: true
    },
    email : {
        type: String, required: true
    },
    phonenumber : {
        type: String, required: true
    },

    vehicaletype : {
        type: String, required: true
    },
    vehicalenumber: {
        type: String, required: true
    },
    selectservice : {
        type: String, required: true
    },
    branch: {
        type: String, required: true  
    },
    fromdate : {
        type: String, required: true
    },
    comments: {
        type: String, required: true
    },



})

module.exports = mongoose.model('Posts', postSchema);


 
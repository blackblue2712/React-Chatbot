const mongoose = require("mongoose");

const registrationSchema = mongoose.Schema({
    name: String,
    address: String,
    phone: String,
    email: String,
    registerDate: {
        type: Date,
        default: Date.now
    } 
});

const Registration = mongoose.model("Registration", registrationSchema);

module.exports = Registration;
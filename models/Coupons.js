const mongoose = require("mongoose");

const couponsSchema = mongoose.Schema({
    course: String,
    link: String
});

const Coupons = mongoose.model("Coupons", couponsSchema);

module.exports = Coupons;
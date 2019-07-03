const mongoose = require("mongoose");

const demandSchema = mongoose.Schema({
    course: String,
    counter: {
        type: Number,
        default: 1
    }
});

const Demand = mongoose.model("Demand", demandSchema);

module.exports = Demand;
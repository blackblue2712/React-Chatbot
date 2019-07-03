// Import dependencies
const express = require('express');
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const config = require("./config/key");

console.log(config.mongoURI);

mongoose.connect("mongodb+srv://nhuhao:9Hj6@hq2@cluster0-ypygk.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});

// Import routes
const dialogFlowRoutes = require("./routes/dialogFlowRoutes");
const fulfilmentRoutes = require("./routes/fulfilmentRoutes");

// Config process.env
require('dotenv').config();

// Constant variable
const PORT = process.env.PORT || 5000;

// Use middleawre
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');
    next();
})
app.use(bodyParser.json());
app.use("/", dialogFlowRoutes);
app.use("/", fulfilmentRoutes);

if(process.env.NODE_ENV === "production") {
    app.use(express.static('client/build'));

    // index.html for all page routes
    const path = require("path");
    app.get('*', (req, res) => {
        console.log(path.resolve(__dirname, 'client', 'build', 'index.html'))
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}

app.listen(PORT, () => {
    console.log(`React chatbot for webpage listen on port ${PORT}`);
});
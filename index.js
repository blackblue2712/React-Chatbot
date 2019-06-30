// Import dependencies
const express = require('express');
const bodyParser = require("body-parser");
const app = express();

// Import routes
const dialogFlowRoutes = require("./routes/dialogFlowRoutes");

// Config process.env
require('dotenv').config();

// Constant variable
const PORT = process.env.PORT || 5000;

// Use middleawre
app.use(bodyParser.json());
app.use("/", dialogFlowRoutes);

app.listen(PORT, () => {
    console.log(`React chatbot for webpage listen on port ${PORT}`);
});
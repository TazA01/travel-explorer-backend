const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cityRoutes = require('./routes/trips');
const mongoose = require('mongoose');
const City = require('./models/Cities');
dotenv.config();
const cors = require("cors");
app.use(cors());
app.use(express.json());

//Connecting to the database
mongoose.set("strictQuery", false);
mongoose.connect(`${process.env.MONGO_URL}`).
    then(() => console.log('DB Connection Open'))
    .catch(error => {
        console.log(error)
        return error
    });

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/', cityRoutes);


//listening to any incoming requests 
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})

module.exports = app
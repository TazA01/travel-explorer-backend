const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cityRoutes = require("./Routes/trips");
const mongoose = require("mongoose");
dotenv.config();
const cors = require("cors");

app.use(express.json());
app.use(cors());

//Connecting to the database
mongoose.set("strictQuery", false);

mongoose.connect(`${process.env.MONGO}`).
    then(() => {
        console.log("DB Connection Open")
    })
    .catch(error => {
        console.log(error.message)
        return error
    });

app.use('/', cityRoutes);


//listening to any incoming requests 
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})

module.exports = app
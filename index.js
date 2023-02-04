const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cityRoutes = require('./routes/trips');
dotenv.config();
let cors = require("cors");
app.use(cors());


//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', cityRoutes);
app.use('/cities', cityRoutes);
app.use('/cities/test', cityRoutes);



//listening to any incoming requests 
app.listen(process.env.PORT, () => {
    console.log(`Listening on port ${process.env.PORT}`)
})

module.exports = app
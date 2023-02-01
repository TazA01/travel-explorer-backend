//what packages we require for this codebase
//console.dir(app)
//nodemon will automatically refresh the server so you don't have to keep stop/start the server
const express = require('express'); //require express for this file
const app = express(); //execute the express function 
const path = require('path');
const mongoose = require('mongoose');
const Cities = require('./models/cities');
const seed = require('./seed');
const axios = require('axios');
const { validate } = require('./models/cities');

mongoose.connect('mongodb://127.0.0.1:27017/cities')
    .then(() => {
        console.log("Mongo Connection Open!")

    })
    .catch(err => {
        console.log("Oh No Mongo Connection Error!")
        return (err)
    })
//configuring ejs for express, creating dynamic html with templating 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

//CRUD routes 

//get all cities in the database 
app.get('/cities', async (req, res) => {
    const city = await Cities.find({});
    //console.log(city)
    res.send(city);
})

//validate id function
// const validateId = (id) => {
//     try {
//         const objectID = new mongoose.Types.ObjectId(id);
//         const objectIDString = objectID.toString();
//         return objectIDString === id;
//     } catch (e) {
//         return false;
//     }
// };

//get city based on id
app.get('/cities/:id', async (req, res) => {
    const { id } = req.params;
    const citiesbyId = await Cities.findById(id);
    res.send(citiesbyId);
})

// app.get('/', (req, res) => {
//     res.render('home') //this is going to render the home file 
// })


// app.use(express.urlencoded({ extended: true }))

//what port we are listening on 
app.listen(3000, () => {
    console.log('Listening on port 3000')
})


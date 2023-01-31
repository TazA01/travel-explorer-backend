//what packages we require for this codebase
//console.dir(app)
//nodemon will automatically refresh the server so you don't have to keep stop/start the server
const express = require('express'); //require express for this file
const app = express(); //execute the express function 
const path = require('path');
const mongoose = require('mongoose');
const Product = require('./models/product')

mongoose.connect('mongodb://127.0.0.1:27017/farmstand')
    .then(() => {
        console.log("Mongo Connection Open!")
    })
    .catch(err => {
        console.log("Oh No Mongo Connection Error!")
        console.log(err)
    })
//configuring ejs for express, creating dynamic html with templating 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

//CRUD routes 
app.get('/', (req, res) => {
    res.render('home') //this is going to render the home file 
})

app.get('/random', (req, res) => {
    const randomNum = Math.floor(Math.random() * 10) + 1;
    res.render('random', { rand: randomNum })
})

app.use(express.urlencoded({ extended: true }))

app.get('/food', (req, res) => {
    res.render('food')
    res.send("GET /food response")
})

app.post('/food', function (req, res, next) {
    res.send(req.body)
})


//what port we are listening on 
app.listen(3000, () => {
    console.log('Listening on port 3000')
})


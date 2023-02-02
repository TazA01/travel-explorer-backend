const mongoose = require('mongoose');
const axios = require('axios');


mongoose.connect('mongodb://127.0.0.1:27017/cities')
    .then(() => {
        console.log("Mongo Connection Open!")

    })
    .catch(err => {
        console.log("Oh No Mongo Connection Error!")
        return (err)
    })
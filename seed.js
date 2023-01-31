const mongoose = require('mongoose');
const Cities = require('./models/cities');


mongoose.connect('mongodb://127.0.0.1:27017/cities')
    .then(() => {
        console.log("Mongo Connection Open!")
    })
    .catch(err => {
        console.log("Oh No Mongo Connection Error!")
        console.log(err)
    })

const p = new Cities({
    city_one: 'Paris',
    city_two: 'Aspen'
})

p.save().then(p => {
    console.log(p)
    return (p)
})
    .catch(err => {
        console.log(err)
    })
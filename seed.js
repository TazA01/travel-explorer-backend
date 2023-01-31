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

const p = new Product({
    name: 'Ruby Grapefruit',
    price: 1.99,
    category: "fruit"
})

p.save().then(p => {
    console.log(p)
})
    .catch(err => {
    console.log(err)
})
const mongoose = require('mongoose');

const citiesSchema = new mongoose.Schema({
    city_one: { type: String, required: true },
    city_two: { type: String, required: true },
    city_three: { type: String, required: true },
    city_four: { type: String, required: true },
    city_five: { type: String, required: true }
})

const Cities = mongoose.model('Cities', citiesSchema);

module.exports = Cities;
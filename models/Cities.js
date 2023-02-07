const mongoose = require('mongoose');
const express = require("express");
const app = express();

const citySchema = new mongoose.Schema({
    name: String,
    places: { type: Map, of: String }
})

const City = mongoose.model('City', citySchema);

module.exports = City; 
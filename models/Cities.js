const mongoose = require('mongoose');
const express = require("express");

const citySchema = new mongoose.Schema({
    city: String,
    country: String,
    fullLocation: String,
    image: String,
    places: Array
})

const City = mongoose.model('City', citySchema);

module.exports = City; 
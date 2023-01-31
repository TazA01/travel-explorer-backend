const mongoose = require('mongoose');
const axios = require('axios');


const getFiveCities = (result) => {
    let countries = [];
    let countryCities = [];
    let fiveCities = [];

    for (let country = 0; country < 5; country++) {
        let countryNum = Math.floor(Math.random() * result.length);
        countries.push(result[countryNum].cities);
    }

    for (cities in countries) {
        for (city in countries[cities]) {
            countryCities.push((countries[cities][city]));
        }
    }

    for (let city = 0; city < 5; city++) {
        let cityNum = Math.floor(Math.random() * countryCities.length);
        fiveCities.push(countryCities[cityNum]);
    }

    return fiveCities;
}


let r = axios.get("https://countriesnow.space/api/v0.1/countries")
    .then(function (response) {
        let result = response.data.data
        let cityArr = (getFiveCities(result))
        return (cityArr)
    })



const citiesSchema = new mongoose.Schema({
    city_one: String,
    city_two: String
})

const Cities = mongoose.model('Cities', citiesSchema);

module.exports = Cities;
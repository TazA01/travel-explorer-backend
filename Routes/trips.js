const express = require('express');
const app = express();
const axios = require('axios');
const Cities = require('/Users/tazmeen/ada/projects/travel-explorer-backend/Models/cities.js');;

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



app.get('/', (req, res) => {
    axios.get("https://countriesnow.space/api/v0.1/countries")
        .then(function (response) {
            let result = response.data.data;
            const cityArr = (getFiveCities(result));
            console.log(cityArr);
            res.send(cityArr);
        })

        .catch(err => {
            return (err)
        })

})


module.exports = app;

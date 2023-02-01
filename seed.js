const mongoose = require('mongoose');
const Cities = require('./models/cities');
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


mongoose.connect('mongodb://127.0.0.1:27017/cities')
    .then(() => {
        //console.log("Mongo Connection Open!")
        axios.get("https://countriesnow.space/api/v0.1/countries")
            .then(function (response) {
                let result = response.data.data;
                let cityArr = [...getFiveCities(result)];
               
                const newEntry = new Cities({
                    city_one: cityArr[0],
                    city_two: cityArr[1],
                    city_three: cityArr[2],
                    city_four: cityArr[3],
                    city_five: cityArr[4]
                })

                newEntry.save().then(newEntry => {
                    return (newEntry)
                })
                    .catch(err => {
                        return(err)
                    })
            })

    })
    .catch(err => {
        return (err)
    })


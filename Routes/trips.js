const express = require('express');
const app = express();
const axios = require("axios");

//----------------------------------functions for API calls-------------------------------------------
//get random 5 numbers
const getFiveNumbers = ((arr) => {
    let fiveNumbers = [];
    for (let city = 0; city < 5; city++) {
        let cityNum = Math.floor(Math.random() * arr.length);
        fiveNumbers.push(arr[cityNum]);
    }
    return fiveNumbers;
})

//get an array with 5 cities
async function getFiveCities() {
    let cityArr = [];
    const result = await axios.get('https://countriesnow.space/api/v0.1/countries');
    const data = result.data.data;
    for (let i = 0; i < data.length; i++) {
        cityArr.push(data[i]['cities'])
    }
    let oneArr = cityArr.flat();
    return (getFiveNumbers(oneArr));
}


//function to get coordinates of cities
async function getCoordinatesandCountry() {
    let cityObj = {}
    let fiveCities = await getFiveCities()
    for (city in fiveCities) {
        let coordinates = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${fiveCities[city]}&lang=en&limit=100&type=city&apiKey=${process.env.API_KEY}`);
        min = Math.ceil(1);
        max = Math.floor(coordinates.data.features.length - 1);
        let randomNum = Math.floor(Math.random() * (max - min) + min);
        cityObj[fiveCities[city]] = {
            "country": coordinates.data.features[randomNum].properties.country,
            "region": coordinates.data.features[randomNum].properties.state ? coordinates.data.features[randomNum].properties.state : coordinates.data.features[randomNum].properties.municipality,
            "lon": coordinates.data.features[randomNum].properties.lon,
            "lat": coordinates.data.features[randomNum].properties.lat,
            //"coordinates": [coordinates.data.features[randomNum].properties.lon, coordinates.data.features[randomNum].properties.lat],
            "entertainment": {},
            "leisure": {},
            "nature": {},
            "tourism": {},
            "food": {},
        };

    };
    return cityObj;
};

//----------------------------------------ROUTES-------------------------------------------------------

app.route('/').get((req, res) => { res.json({ message: "Hello from server!" }) })

//get all cities
app.route('/cities').get(async (req, res) => {
    let place = await getCoordinatesandCountry();
    res.send(place);
});

//get entertainment places
app.route('/cities/entertainment').get(async (req, res) => {
    let place = await getCoordinatesandCountry();

    for (let i = 0; i < 3; i++) {
        for (city in place) {
            let preferences = await axios.get(`https://api.geoapify.com/v2/places?categories=${req.body.entertainment}&filter=circle:${place[city]['lon']},${place[city]['lat']},200000&bias=proximity:${place[city]['lon']},${place[city]['lat']}&limit=3&apiKey=${process.env.API_KEY}`);
            let results = preferences.data.features[i].properties;
            place[city]['entertainment'][results.name] = results.address_line2;
        };


    };
    res.send(place)

});

//get leisure places
app.route('/cities/leisure').get(async (req, res) => {
    let place = await getCoordinatesandCountry();
    for (city in place) {
        for (let i = 0; i < 3; i++) {
            let preferences = await axios.get(`https://api.geoapify.com/v2/places?categories=${req.body.leisure}&filter=circle:${place[city]['lon']},${place[city]['lat']},50000&bias=proximity:${place[city]['lon']},${place[city]['lat']}&limit=3&apiKey=${process.env.API_KEY}`);
            let results = preferences.data.features[i]
            place[city]['leisure'][results.properties.name] = results.properties.address_line2;
        };
    };
    res.send(place);

});

//get nature places
app.route('/cities/nature').get(async (req, res) => {
    let place = await getCoordinatesandCountry();
    for (city in place) {
        for (let i = 0; i < 3; i++) {
            let preferences = await axios.get(`https://api.geoapify.com/v2/places?categories=${req.body.nature}&filter=circle:${place[city]['lon']},${place[city]['lat']},100000&bias=proximity:${place[city]['lon']},${place[city]['lat']}&limit=3&apiKey=${process.env.API_KEY}`);
            let results = preferences.data.features[i]
            place[city]['nature'][results.properties.name] = results.properties.address_line2;
        };
    };
    res.send(place);
});

//get tourism places
app.route('/cities/tourism').get(async (req, res) => {
    let place = await getCoordinatesandCountry();
    for (city in place) {
        for (let i = 0; i < 3; i++) {
            let preferences = await axios.get(`https://api.geoapify.com/v2/places?categories=${req.body.tourism}&filter=circle:${place[city]['lon']},${place[city]['lat']},50000&bias=proximity:${place[city]['lon']},${place[city]['lat']}&limit=3&apiKey=${process.env.API_KEY}`);
            let results = preferences.data.features[i]
            place[city]['tourism'][results.properties.name] = results.properties.address_line2;
        };

    };
    res.send(place);

});

//get food places
app.route('/cities/food').get(async (req, res) => {
    let place = await getCoordinatesandCountry();
    for (city in place) {
        for (let i = 0; i < 3; i++) {
            let preferences = await axios.get(`https://api.geoapify.com/v2/places?categories=${req.body.food}&filter=circle:${place[city]['lon']},${place[city]['lat']},50000&bias=proximity:${place[city]['lon']},${place[city]['lat']}&limit=3&apiKey=${process.env.API_KEY}`);
            let results = preferences.data.features[i]
            place[city]['food'][results.properties.name] = results.properties.address_line2;
        };
    };
    res.send(place);
});


module.exports = app;
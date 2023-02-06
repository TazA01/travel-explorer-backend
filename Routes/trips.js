const express = require('express');
const app = express();
const axios = require("axios");

//-------------------------------------------FUNCTIONS-------------------------------------------//
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
async function getCoordinates() {
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
            "lat": coordinates.data.features[randomNum].properties.lat
        };

    };
    return cityObj;
};


const getAllData = async (body) => {
    const places = await getCoordinates();
    let userInput = Object.values(body);

    for (city in places) {
        preferences = await axios.get(`https://api.geoapify.com/v2/places?categories=${userInput[0]},${userInput[1]},${userInput[2]},${userInput[3]},${userInput[4]}&filter=circle:${places[city]['lon']},${places[city]['lat']},30000&bias=proximity:${places[city]['lon']},${places[city]['lat']}&limit=500&apiKey=${process.env.API_KEY}`);

        for (let i = 0; i < preferences.data.features.length; i++) {
            let searchResults = preferences.data.features;
            if (searchResults == false) {
                continue;
            } else {
                places[city][searchResults[i].properties.name] = { "address": searchResults[i].properties.address_line2, "category": searchResults[i].properties.categories[1] };
            }

        }

    }
    return places;
}

//----------------------------------------ROUTES-------------------------------------------------------//

app.route('/').get((req, res) => { res.json({ message: "Hello from server!" }) })


app.route('/cities').post(async (req, res) => {
    let searchRes = await getAllData(req.body);
    res.send(searchRes);
});



module.exports = app;
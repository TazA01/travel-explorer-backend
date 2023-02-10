const express = require('express');
const app = express();
const axios = require("axios");
const City = require('../models/Cities');

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

const getCoordinates = async () => {
    let cityObj = {}
    let fiveCities = await getFiveCities()
    const timer = ms => new Promise(res => setTimeout(res, ms))
    for (let city in fiveCities) {
        let coordinates = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.LOCATIONIQ_API_KEY}&q=${fiveCities[city]}&format=json`);
        min = Math.ceil(1);
        max = Math.floor(coordinates.data.length - 1);
        let randomNum = Math.floor(Math.random() * (max - min) + min);
        cityObj[fiveCities[city]] = {
            "lon": coordinates.data[randomNum].lon,
            "lat": coordinates.data[randomNum].lat,
            "name": coordinates.data[randomNum].display_name,
            "country": coordinates.data[randomNum].display_name.split(",").pop(),
            "places": {},
        };

        await timer(400);
    };

    return cityObj;

}


const getAllData = async (body) => {
    const cities = await getCoordinates();
    let userInput = Object.values(body);
    let preferences;
    let images;
    let imgResults;

    for (let city in cities) {
        preferences = await axios.get(`https://api.geoapify.com/v2/places?categories=${userInput[0]},${userInput[1]},${userInput[2]},${userInput[3]},${userInput[4]}&filter=circle:${cities[city]['lon']},${cities[city]['lat']},80000&bias=proximity:${cities[city]['lon']},${cities[city]['lat']}&limit=100&apiKey=${process.env.GEOAPIFY_API_KEY}`);

        for (let i = 0; i < preferences.data.features.length; i++) {
            let searchResults = preferences.data.features;
            if (searchResults == false) {
                continue;
            } else {
                cities[city].places[searchResults[i].properties.name] = { 'address': searchResults[i].properties.address_line2, "category": searchResults[i].properties.categories[1] };
            }
        }

        images = await axios.get(`https://api.pexels.com/v1/search?query=${cities[city].country}&page=1&per_page=1&orientation=square`);
        imgResults = images.data.photos[0].src.medium;
        cities[city].image = imgResults;

    }
    return cities;
}

//----------------------------------------ROUTES-------------------------------------------------------//


app.route('/cities').post(async (req, res) => {
    let searchRes = await getAllData(req.body);
    console.log(searchRes);
    res.status(200).send(searchRes);
    //res.status(404).send("Oh uh, something went wrong");

});

app.get('/', (req, res) => {
    res.json({ message: "Hello from server!" });
});


//iterate through db and see if there is a saved city and country
app.route('/cities/save').post((req, res) => {
    let newCity = new City({ name: 'Paris', places: { 'cafe': 'outerbanks', 'restaurant': 'My home' } });
    newCity.save();
    res.send(newCity)
});

app.route('/cities/places/save').post((req, res) => {

});


module.exports = app;
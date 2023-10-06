const express = require('express');
const app = express();
const axios = require("axios");
const City = require('../models/Cities');

//-------------------------------------------FUNCTIONS-------------------------------------------//
//get an array with 5 cities and their countries 
async function getFiveCities() {
    let citiesArr = [];
    const result = await axios.get('https://countriesnow.space/api/v0.1/countries');
    const data = result.data.data;

    for (let i = 0; i < 5; i++) {
        let randomCountry = Math.floor(Math.random() * data.length);
        let randomCity = Math.floor(Math.random() * data[randomCountry].cities.length);
        citiesArr.push([data[randomCountry]['cities'][randomCity], data[randomCountry]['country']])

    }
    return citiesArr;
}

const getCoordinates = async () => {
    let cityObj = {};
    const fiveCities = await getFiveCities();
    const timer = ms => new Promise(res => setTimeout(res, ms))

    for (let city in fiveCities) {
        let coordinates = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.LOCATIONIQ_API_KEY}&q=${fiveCities[city][0]}%2C%20${fiveCities[city][1]}&format=json`);

        //Randomize cities of the same name but in different states or provinces within a country
        let randomIdx = Math.floor(Math.random() * coordinates.data.length);

        cityObj[fiveCities[city][0]] = {
            "lon": coordinates.data[randomIdx].lon,
            "lat": coordinates.data[randomIdx].lat,
            "name": coordinates.data[randomIdx].display_name,
            "country": fiveCities[city][1],
            "places": {},
        }

        await timer(400);
    };
    return cityObj;
};

const getImages = async () => {
    const cities = await getCoordinates();
    for (let city in cities) {
        let images;
        let imgResults;

        images = await axios.get(`https://api.unsplash.com/search/photos?page=1&query=${cities[city].country}&client_id=${process.env.IMAGE_APIKEY}`);
        imgResults = images.data.results[2].urls.small;
        cities[city].image = imgResults;

    }
    return cities;
}


const getAllData = async (body) => {
    const cities = await getImages();
    let userInput = Object.values(body);
    let preferences;

    for (let city in cities) {
        preferences = await axios.get(`https://api.geoapify.com/v2/places?categories=${userInput[0]},${userInput[1]},${userInput[2]},${userInput[3]},${userInput[4]}&filter=circle:${cities[city]['lon']},${cities[city]['lat']},50000&limit=15&apiKey=${process.env.GEOAPIFY_API_KEY}`);

        for (let i = 0; i < preferences.data.features.length; i++) {
            let searchResults = preferences.data.features;
            if (searchResults == false || searchResults[i].properties.name == 'undefined' || !searchResults[i].properties.address_line2 || !searchResults[i].properties.name) {
                continue;
            } else {
                cities[city].places[searchResults[i].properties.name] = { 'address': searchResults[i].properties.address_line2, "category": searchResults[i].properties.categories[1] };
            }
        }

    }
    return cities;
}

//----------------------------------------ROUTES-------------------------------------------------------//


app.route('/cities').post(async (req, res) => {
    let searchRes = await getAllData(req.body);
    res.status(200).send(searchRes);

});

app.get('/', (req, res) => {
    res.json({ message: "Hello from server!" });
});


//save city and places
app.route('/cities/save').post((req, res) => {

    let newCity = new City({ "city": req.body.city, "country": req.body.country, "fullLocation": req.body.fullLocation, "image": req.body.image, "places": req.body.places });
    newCity.save();
    res.send(newCity);
});

//get all saved cities
app.get('/cities/save', async (req, res) => {
    const getAllCities = await City.find({});
    res.send(getAllCities);

});

//delete a city in database 
app.delete('/cities/delete/:id', async (req, res) => {
    id = req.params.id;
    await City.deleteOne({ _id: id });
    res.send("deleted")
})

module.exports = app;
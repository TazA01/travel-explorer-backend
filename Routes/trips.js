const express = require('express');
const app = express();
const axios = require("axios");
const City = require('../models/Cities');

//-------------------------------------------FUNCTIONS-------------------------------------------//
const getFiveNumbers = (arr) => {
    const shuffled = arr.slice().sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 5);
};

//get an array with 5 cities
async function getFiveCities() {
    let citiesArr = [];
    const result = await axios.get('https://countriesnow.space/api/v0.1/countries');
    const data = result.data.data;
    //console.log(data);

    for (let i = 0; i < 5; i++) {
        let randomCountry = Math.floor(Math.random() * data.length);
        let randomCity = Math.floor(Math.random() * data[randomCountry].cities.length);
        citiesArr.push([data[randomCountry]['cities'][randomCity], data[randomCountry]['country']])

    }
    //console.log(citiesArr);
    return citiesArr;
    // return (getFiveNumbers(oneArr));
}
//console.log(getFiveCities())

const getCoordinates = async () => {
    let cityObj = {}
    let fiveCities = await getFiveCities()
    const timer = ms => new Promise(res => setTimeout(res, ms))
    //console.log('cities',fiveCities)
    for (let city in fiveCities) {
        // let KEY = 'pk.10b4fc53dea807481060cefff7cc2ba4';
        let coordinates = await axios.get(`https://us1.locationiq.com/v1/search?key=${process.env.LOCATIONIQ_API_KEY}&q=${fiveCities[city][0]}%2C%20${fiveCities[city][1]}&format=json`);
        //console.log(coordinates.data);
        // min = Math.ceil(1);
        // max = Math.floor(coordinates.data.length - 1);
        // let randomNum = Math.floor(Math.random() * (max - min) + min);
        cityObj[fiveCities[city][0]] = {
            "lon": coordinates.data[0].lon,
            "lat": coordinates.data[0].lat,
            "name": coordinates.data[0].display_name,
            "country": fiveCities[city][1],
            "places": {},
        }
        await timer(350);
    };


    //console.log(cityObj);
    return cityObj;
};

//console.log(getCoordinates())

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
    //console.log(cities);
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
    //console.log(cities);
    return cities;
}
//console.log(getAllData())

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
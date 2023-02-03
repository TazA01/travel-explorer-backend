const express = require('express');
const app = express();
const axios = require("axios");

//functions for API calls

//get random 5 numbers
const getFiveCities = ((arr) => {
    let fiveCities = [];
    for (let city = 0; city < 5; city++) {
        let cityNum = Math.floor(Math.random() * arr.length);
        fiveCities.push(arr[cityNum]);
    }
    return fiveCities;
})

//get an array with 5 cities
async function getCities() {
    let cityArr = [];
    const result = await axios.get('https://countriesnow.space/api/v0.1/countries');
    const data = result.data.data;
    for (let i = 0; i < data.length; i++) {
        cityArr.push(data[i]['cities'])
    }
    let oneArr = cityArr.flat();
    return (getFiveCities(oneArr));
}


//function to get place_id of cities
async function getPlaceId() {
    let cityObj = {}
    fiveCities = await getCities()
    for (city in fiveCities) {
        let coordinates = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${fiveCities[city]}&lang=en&limit=1&type=city&apiKey=${process.env.API_KEY}`)
        //console.log(coordinates.data.features[0].properties.lon,coordinates.data.features[0].properties.lat)
        cityObj[fiveCities[city]] = [{ "place_id": coordinates.data.features[0].properties.place_id }];

    }
    console.log(cityObj);
    return cityObj;
};



//get preferences from user 
app.route('/cities').get((req, res) => {
    let entertainment = req.body.entertainment;
    let leisure = req.body.leisure;
    let nature = req.body.nature;
    let tourism = req.body.tourism;
    let food = req.body.food;
    let drinksAndDesserts = req.body.drinksAndDesserts;
    res.send({
        'entertainment': entertainment,
        'leisure': leisure,
        'nature': nature,
        'tourism': tourism,
        'food': food,
        'drinks and desserts': drinksAndDesserts
    })
});

//get 5 countries and subcategories
app.route('/cities/test').get(async (req, res) => {
    let place = await getPlaceId()
    for (let city in place) {
        let preferences = await axios.get(`https://api.geoapify.com/v2/places?categories=${req.body.entertainment},${req.body.leisure}&filter=place:${place[city][0].place_id}&limit=3&apiKey=${process.env.API_KEY}`);
        place[city]['entertainment'] = { "name": preferences.data.features[0] }
        //coordinates[city]['name2'] = preferences.data.features[1].properties.name
        console.log(preferences.data.features[0])

    }
    //console.log(place)
    //console.log(preferences.data.features)

});


app.route('/').get((req, res) => { res.json({ message: "Hello from server!" }) })

module.exports = app;
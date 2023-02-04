const express = require('express');
const app = express();
const axios = require("axios");

//cityObj = {city_name_here: 
//{'coordinates': [lon, lat],  
//'entertainment': { 'name1': 'address', 'name2': 'address', 'name3': 'address' },
//'leisure': { 'name1': 'address', 'name2': 'address', 'name3': 'address' }, 
//'restaurants': { 'name1': 'address', 'name2': 'address', 'name3': 'address' },
//'tourism':{'name1':'address','name2':'address', 'name3':'address'},
//'drinks_and_desserts': { 'name1': 'address', 'name2': 'address', 'name3': 'address' },
//'nature': { 'name1': 'address', 'name2': 'address', 'name3': 'address' }
//}, city_name_here{'entertainment': {'name1': 'address', 'name2': 'address', 'name3': 'address' },
//'leisure': { 'name1': 'address', 'name2': 'address', 'name3': 'address' }, 
//'restaurants': { 'name1': 'address', 'name2': 'address', 'name3': 'address' },
//'tourism':{'name1':'address','name2':'address', 'name3':'address'},
//'drinks_and_desserts': { 'name1': 'address', 'name2': 'address', 'name3': 'address' },
//'nature': { 'name1': 'address', 'name2': 'address', 'name3': 'address' }
//}

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
async function getCoordinates() {
    let cityObj = {}
    fiveCities = await getCities()
    for (city in fiveCities) {
        let coordinates = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${fiveCities[city]}&lang=en&limit=1&type=city&apiKey=${process.env.API_KEY}`)
        //console.log(coordinates.data.features[0].properties.lon,coordinates.data.features[0].properties.lat)
        cityObj[fiveCities[city]] = { "coordinates": [coordinates.data.features[0].properties.lon, coordinates.data.features[0].properties.lat], "entertainment": {} };

    }
    //console.log(cityObj);
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
    let place = await getCoordinates()
    for (city in place) {
        for (let i = 0; i < 3; i++) {
            let preferences = await axios.get(`https://api.geoapify.com/v2/places?categories=${req.body.entertainment}&bias=proximity:${place[city]['coordinates'][0]},${place[city]['coordinates'][1]}&limit=3&apiKey=${process.env.API_KEY}`);
            let results = preferences.data.features
            place[city]['entertainment'][results[i].properties.name] = results[i].properties.address_line2;
        };
        //place[city]['entertainment'] += { "name2": results[1]['properties'].name, "address": results[1]['properties'].address_line2 };
        //place[city]['entertainment'] += { "name3": results[2]['properties'].name, "address": results[2]['properties'].address_line2 };
        //coordinates[city]['name2'] = preferences.data.features[1].properties.name
    }
    //console.log(preferences.data.features[0].properties)
    console.log(place)

    //console.log(preferences.data.features
});


app.route('/').get((req, res) => { res.json({ message: "Hello from server!" }) })

module.exports = app;
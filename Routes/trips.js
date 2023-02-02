const express = require('express');
const app = express();

//app.post() - get preferences from post 
app.route('/preferences').post((req, res) => {
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
        'drinks and desserts':drinksAndDesserts   
    })
});

//get 5 countries and subcategories
app.route('/cities').get((res, req) => {
    
})


app.route('/').get((req, res) => { res.json({ message: "Hello from server!" }) })

module.exports = app;
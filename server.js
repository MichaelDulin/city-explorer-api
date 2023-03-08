"use strict";

const express = require("express");
require("dotenv").config();
let data = require("./data/weather.json");
const cors = require("cors");
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;




app.get("/", (req, res) => {
  res.send("Hello from my server!");
});

app.get('/weather', (request, response) => {
    let citySearched = request.query.search;
    let getCity = data.find(search => search.city_name===citySearched)
    let cityWeatherData = new Forecast(getCity);

});

app.get("*", (req, res) => {
  res.send("The resource does not exist");
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));



class Forecast {
    constructor(City){
        this.date = City.data[0].valid_date;
        this.description = City.data[0];
    }
}
"use strict";

const express = require("express");
require("dotenv").config();
//const data = require("./data/weather.json");
const cors = require("cors");
const { response } = require("express");
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get("/", (req, res) => {
  res.send("Hello from my server!");
});

// MOVIE API URL: https://api.themoviedb.org/3/movie/550?api_key=e705c3663e6bd4140c40367e84dbe954



app.get("/weather", async (request, response, next) => {
  try {
    let lat = request.query.lat;
    let long = request.query.lon;
    let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=I&days=3&lat=${lat}&lon=${long}`;

    let weatherData = await axios.get(url);
    let forecastArr = weatherData.data.data.map(dailyForecast => {
      return new Forecast(dailyForecast);
    })
    response.send(forecastArr);
  } catch (error) {
    next(error);
  }
});

app.get("*", (req, res) => {
  res.send("The resource does not exist");
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message)
});




class Forecast {
  constructor(City) {
    this.date = City.valid_date;
    this.description = `Low of ${City.low_temp}, high of ${City.max_temp} with ${City.weather.description}`
  }
}



app.listen(PORT, () => console.log(`listening on ${PORT}`));

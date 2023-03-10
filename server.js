"use strict";

const express = require("express");
require("dotenv").config();
//const data = require("./data/weather.json");
const cors = require("cors");
const { response } = require("express");
const { default: axios } = require("axios");
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3002;

app.get("/", (req, res) => {
  res.send("Hello from my server!");
});

// MOVIE API URL: https://api.themoviedb.org/3/movie/550?api_key=e705c3663e6bd4140c40367e84dbe954



app.get("/weather", async (request, response, next) => {
    let lat = request.query.lat;
    let long = request.query.lon;

    let weatherUrl = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${long}&key=${process.env.WEATHER_API_KEY}`;
    // let url = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=I&days=3&lat=${lat}&lon=${long}`;

    let weatherData = await axios.get(weatherUrl);
    let forecastArr = weatherData.data.data.map(dailyForecast => new Forecast(dailyForecast));
    response.send(forecastArr);
});


app.get('/movie', async (request, response, next) => {
  let searchBy = request.query.city;
  let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${searchBy}`;
  
  let movieData = await axios.get(movieUrl);
  let movieArr = movieData.data.results.map(movie => new Movie(movie));
  response.send(movieArr);
 
});

app.get("*", (req, res) => {
  res.send("The resource does not exist");
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message)
});




class Forecast {
  constructor(forecast) {
    this.date = forecast.valid_date;
    this.description = `Low of ${forecast.low_temp}, high of ${forecast.max_temp} with ${forecast.weather.description}`
  }
}
class Movie {
  constructor(movies) {
    this.title = movies.original_title;
    this.releasedDate = movies.release_date;
    this.img_url = `https://image.tmdb.org/t/p/w200${movies.poster_path}`;
  }
}



app.listen(PORT, () => console.log(`listening on ${PORT}`));

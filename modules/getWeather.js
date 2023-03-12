'use strict';

const axios = require('axios');

class Forecast {
  constructor(weatherObject){;
    this.date = weatherObject.valid_date;
    this.description = `Low of ${weatherObject.low_temp}, high of ${weatherObject.max_temp} with ${weatherObject.weather.description}`;
  }
}

async function getWeather(request, response, next){
  try{
    let latitude = request.query.lat;
    let longitude = request.query.lon;

    let weatherUrl = `https://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHER_API_KEY}&units=I&days=3&lat=${latitude}&lon=${longitude}`;
    let x = await axios.get(weatherUrl);
    let arr = x.data.data.map(curDay => {
      let forecast = new Forecast(curDay);
      return forecast;
    });

    response.send(arr);
  } catch (error){
    next(error);
  }
}

module.exports = getWeather;
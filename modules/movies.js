'use strict';

const axios = require('axios');
let cache = require('./cache.js');

class Movie {
  constructor(movieObject) {
    this.title = movieObject.title;
    this.image_url = movieObject.poster_path;
    this.released_on = movieObject.release_date;
  }
}

async function getMovies(request, response, next){
    try{
      let cityName = request.query.city;
      let key = cityName + 'Data';
      let timeToCache = 1000*60*60*24*30;
  
      if(cache[key] && Date.now() - cache[key].timestamp < timeToCache){
        response.status(200).send(cache[key].data);
        console.log('Cache hit');
      } else{
        console.log('Cache miss');
        console.log(cityName);
        let movieUrl = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.MOVIE_API_KEY}&language=en-US&page=1&include_adult=false&query=${cityName}&year=2020`;
  
        let newMovie = await axios.get(movieUrl);
        let movieArr = newMovie.data.results.map(movie => {
          let temp = new Movie(movie);
          return temp;
        });
        cache[key] = {
          data: movieArr,
          timestamp: Date.now()
        };
        response.send(movieArr).status(200);
      }
    } catch (error){
      Promise.resolve().then(() => {
        throw new Error(error.message);
      }).catch(next);
    }
  
  }
  
  module.exports = getMovies;
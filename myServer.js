'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');
const getWeather = require('./modules/getWeather');
const getMovies = require('./modules/movies');
const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;



app.get('/weather', getWeather);

app.get('/movies', getMovies);

app.get('/', (request, response) => {
  response.send('Hello from the server');
});

app.get('*', (req, res) => {
  res.send('Resource does not exist');
});

app.use((error, request, response, next) => {
  response.status(500).send(error.message);
});

app.listen(PORT, () => console.log(`listening on ${PORT}`));
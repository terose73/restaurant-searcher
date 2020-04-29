require("dotenv").config();

const axios = require("axios");
const express = require("express");
const app = express();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

app.get("/api/geocode", (req, res) => {
  const address = req.query.address;

  axios
    .get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json?query=" +
        address +
        "&key=" +
        GOOGLE_API_KEY
    )
    .then(response => {
      res.status(200).send(response.data);
    });
});

app.get("/api/find", (req, res) => {
  const latitude = req.query.lat;
  const longitude = req.query.lng;
  const category = req.query.category;

  const url =
    "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
    latitude +
    "," +
    longitude +
    "&radius=3000&opennow&type=restaurant&name=" +
    category +
    "&key=" +
    GOOGLE_API_KEY;

  axios.get(url).then(response => {
    let rest_list = [];

    rest_list = response.data.results;

    coords = rest_list.map(rest => {
      return {
        coordinates: [rest.geometry.location.lat, rest.geometry.location.lng],
        name: rest.name
      };
    });

    const final = { coords: coords, restaurants: rest_list };
    res.status(200).send(final);
  });
});

const port = 4200;
app.listen(port, () => console.log("sever here at port " + port));

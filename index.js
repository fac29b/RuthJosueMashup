import express from "express";
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send("Hello Express")
})

app.listen(port, () => {
  console.log(`server is listening on ${port} `)
})

const url = 'https://dark-sky.p.rapidapi.com/%7Blatitude%7D,%7Blongitude%7D?units=auto&lang=en'
const options = {
  method: "GET",
  headers: {
    'X-RapidAPI-Key': '868db2c1eamshd290e20c8dc8261p1627dejsnf52bb1929fb7',
    'X-RapidAPI-Host': 'dark-sky.p.rapidapi.com'
  }
};




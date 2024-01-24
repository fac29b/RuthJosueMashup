import express from "express";
import fetch from "node-fetch";

const app = express();
const port = process.env.PORT || 3000;
const weatherApi = "93741fb9dc601def24613b455649816c";
// const locationAPIkey = 'b89a10c0495c19371dd07d5a941283700cd68c1a6649b7161518dd4d'

app.get("/", (req, res) => {
  res.send("Hello Express");
});

app.listen(port, () => {
  console.log(`Server is listening on ${port}`);
});

// Using HTTP GET query params:
// /weather
// localhost:3000/weather?lon=3764&lat=74636
// req.query.lon
// req.query.lat

// Using ExpressJS params <https://expressjs.com/en/guide/routing.html>:
// /weather/lon/:lon/lat/:lat
// localhost:3000/weather/lon/5456/lat/74636
// req.params.lon
// req.params.lat

// Expected query params: lon, lat
// e.g. /weather?lon=-74.006&lat=40.7128
app.get("/weather", async (req, res) => {
  try {
    // const locationData = await fetch(locationAPIkey).then(res => res.json());

    const latitude = req.query.lat || 40.7128; // default to New York
    const longitude = req.query.lon || -74.006; // default to New York

    const weatherData = await fetch(
      `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&appid=${weatherApi}`
    ).then((res) => res.json());
    const weatherJson = res.json(weatherData);
    console.log(weatherJson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

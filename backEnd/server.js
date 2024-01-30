import express from "express";
import { SuperfaceClient } from "@superfaceai/one-sdk";
import cors from "cors";
import { OpenAI } from "openai";
import "dotenv/config";

const app = express();
app.set("trust proxy", true);
app.use(cors());

const sdk = new SuperfaceClient();

async function findLocation(latitude, longitude) {
  // Handle the case where latitude and longitude are provided
  if (latitude && longitude) {
    // Load the profile
    const profile = await sdk.getProfile("address/ip-geolocation@1.0.1");

    // Use the profile
    try {
      const result = await profile.getUseCase("IpGeolocation").perform(
        {
          latitude: latitude,
          longitude: longitude,
          city: "London", // Provide a default or sample city value
        },
        {
          provider: "ipdata",
          security: {
            apikey: {
              apikey:
                "b89a10c0495c19371dd07d5a941283700cd68c1a6649b7161518dd4d",
            },
          },
        }
      );

      // Handle the result
      const data = result.unwrap();
      return data;
    } catch (error) {
      console.error(error);
    }
  }

  // Handle default or sample geolocation information
  return {
    ipAddress: "0.0.0.0",
    country_name: "Sample Country",
    state_prov: "Sample State",
    city: "London",
    latitude: "0.0",
    longitude: "0.0",
  };
}

export async function weather(city) {
  // Load the profile
  const profile = await sdk.getProfile("weather/current-city@1.0.3");

  // Use the profile
  const result = await profile.getUseCase("GetCurrentWeatherInCity").perform(
    {
      city: city,
      units: "C",
    },
    {
      provider: "openweathermap",
      security: {
        apikey: {
          apikey: process.env.WEATHER_API_KEY,
          // apikey: "93741fb9dc601def24613b455649816c",
        },
      },
    }
  );
  try {
    // Handle the result
    const data = result.unwrap();
    return data;
  } catch (error) {
    console.error(error);
    return {
      description: "Unknown",
      feelsLike: 0.0,
      temperature: 0.0,
    };
  }
}

export async function getOpenAIResponse(city) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // const openai = new OpenAI({apiKey: "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"});

  const prompt = `Generate a short description about ${city}`;

  try {
    const response = await openai.chat.completions.create({
      max_tokens: 150,
      n: 1,
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      model: "gpt-3.5-turbo",
    });

    const generatedText =
      response.choices[0].message.content || "No description available.";
    return generatedText;
  } catch (error) {
    console.error(error);
    return "Error generating description";
  }
}

app.get("/", async (req, res) => {
  let location; // Initialize location

  try {
    // Use latitude and longitude from the request
    const { latitude, longitude } = req.query;
    location = await findLocation(latitude, longitude);
    console.log("Location:", location);

    // Check if the city is present in the location response
    const city =
      location && location.addressLocality
        ? location.addressLocality
        : "London";

    // Pass the city to the weather function
    const weatherData = await weather(city);
    const openaiResponse = await getOpenAIResponse(city);

    res.send({
      location: location || {},
      weatherData: weatherData || {},
      openaiResponse: openaiResponse || {},
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3007, () => {
  console.log("SERVER RUNNING AT PORT 3007");
});

console.log("Environment:\n", process.env);

export { app, findLocation };

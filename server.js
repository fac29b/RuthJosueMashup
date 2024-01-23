
import express from 'express';
import { SuperfaceClient } from '@superfaceai/one-sdk';
import cors from 'cors';  // Import the cors middleware;


const app = express();
app.set('trust proxy', true);

app.use(cors());  // Enable CORS

const sdk = new SuperfaceClient();

async function findLocation(ip) {
  console.log(ip)
    // Handle loopback address as a special case
    if (ip === '::1' || ip === '::ffff:127.0.0.1') {
      return {
        // Provide default or sample geolocation information
        ipAddress: ip,
        country_name: 'Sample Country',
        state_prov: 'Sample State',
        city: 'Sample City',
        latitude: '0.0',
        longitude: '0.0',
      };
    }
  
    // Load the profile
    const profile = await sdk.getProfile('address/ip-geolocation@1.0.1');
  
    // Use the profile
    try {
      const result = await profile.getUseCase('IpGeolocation').perform(
        {
          ipAddress: ip,
          city: 'London', // Provide a default or sample city value
        },
        {
          provider: 'ipdata',
          security: {
            apikey: {
              apikey: 'b89a10c0495c19371dd07d5a941283700cd68c1a6649b7161518dd4d',
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
  
async function weather(city) {
  // Load the profile
  const profile = await sdk.getProfile('weather/current-city@1.0.3');

  // Use the profile
  const result = await profile.getUseCase('GetCurrentWeatherInCity').perform(
    {
      city: city,
      units: 'C',
    },
    {
      provider: 'openweathermap',
      security: {
        apikey: {
          apikey: 'e7a9bf3833429caee74fbd2f8b9efa3a',
        },
      },
    }
  );

  // Handle the result
  try {
    const data = result.unwrap();
    return data;
  } catch (error) {
    console.error(error);
  }
}

app.get('/', async (req, res) => {
    try {
      const location = await findLocation(req.ip);
      console.log('Location:', location)
  
      // Check if the city is present in the location response
      const city = location && location.addressLocality ? location.addressLocality : 'London';
  
      // Pass the city to the weather function
      const weatherData = await weather(city);
  
      res.send(weatherData);
    } catch (error) {
      if (error.name === 'MappedHTTPError' && error.statusCode === 404) {
        // Extract the city name from the error detail
        const cityName = error.properties && error.properties.detail ? error.properties.detail : 'unknown city';
  
        // Handle 404 Not Found specifically for weather API
        res.status(404).send(`Weather information for ${cityName} not found. Please provide a valid city name.`);
      } else {
        // Handle other errors with a generic message
        console.error(error);  // Log the error for debugging purposes
        res.status(500).send('Internal Server Error');
      }
    }
  });
  
  
  
  

app.listen(3003, () => {
  console.log('SERVER RUNNING AT PORT 3003');
});

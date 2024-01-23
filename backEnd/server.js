
import express from 'express';
import { SuperfaceClient } from '@superfaceai/one-sdk';
import cors from 'cors';  // Import the cors middleware;
import { OpenAI } from 'openai'; // Import the OpenAI package
import dotenv from 'dotenv';
dotenv.config();




const app = express();
app.set('trust proxy', true);

app.use(cors());  // Enable CORS

const sdk = new SuperfaceClient();

async function findLocation(ip) {
      // Handle loopback address as a special case
      if (ip === '::1' || ip === '::ffff:127.0.0.1') {
        return {
          // Provide default or sample geolocation information
          ipAddress: ip,
          country_name: 'Sample Country',
          state_prov: 'Sample State',
          city: 'London',
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

   // Handle the result
   const data = result.unwrap();
   return data;
 } catch (error) {
   console.error(error);
   return {
     ipAddress: ip,
     country_name: 'Unknown Country',
     state_prov: 'Unknown State',
     city: 'Unknown City',
     latitude: '0.0',
     longitude: '0.0',
   };
 }
}

async function getOpenAIResponse(city) {
 
  const openai = new OpenAI(process.env.OPENAI_API_KEY); // Replace with your actual OpenAI API key
    
    // Example prompt: "Generate a short description about {city}"
    const prompt = `Generate a short description about ${city}`;
  
    try {
      // Assuming there is a method like 'createCompletion' or similar
      const response = await openai.chat.completions.create({
        
      max_tokens: 150,
        n: 1,messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        model: "gpt-3.5-turbo",
      });
  
      // Extract the generated text from the response
      const generatedText = response.choices[0].message.content || 'No description available.';
      return generatedText;
    } catch (error) {
      console.error(error);
      return 'Error generating description';
    }
  }

  app.get('/', async (req, res) => {
    try {
      const location = await findLocation(req.ip);
      console.log('Location:', location);
  
      // Check if the city is present in the location response
      const city = location && location.city ? location.city : 'London';
  
      // Pass the city to the weather function
      const weatherData = await weather(city);
      const openaiResponse = await getOpenAIResponse(city);
  
      res.send({ location, weatherData, openaiResponse });
  
    } catch (error) {
      // Handle errors here
      console.error(error);
      res.status(500).send('Internal Server Error');
    }
  });
  
  
  
  
  

app.listen(3003, () => {
  console.log('SERVER RUNNING AT PORT 3003');
});

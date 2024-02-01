const toggleSwitch = document.querySelector("input");
const spinner = document.querySelector(".spinner");
const weatherContainer = document.querySelector("#weather-container");
const locationElement = document.querySelector("#location");
const temperatureElement = document.querySelector("#temperature");
const openaiResponseElement = document.querySelector("#openai-response");

const ENDPOINT_HOSTNAME_PORT =
  "ec2-18-171-228-56.eu-west-2.compute.amazonaws.com:3007";
// const ENDPOINT_HOSTNAME = "localhost:3007";
toggleSwitch.addEventListener("change", function () {
  toggleSwitch.checked
    ? (weatherContainer.style.backgroundColor = "grey")``````
    : (weatherContainer.style.backgroundColor = "white");
});

document.addEventListener("DOMContentLoaded", async () => {
  // Button click event listener for getting location and weather
  const getLocationWeatherButton =
    document.getElementById("getLocationWeather");
  getLocationWeatherButton.addEventListener("click", async () => {
    try {
      // Show spinner while fetching location and weather data
      spinner.style.display = "block";

      // Use the browser's geolocation API to get the user's location
      const userLocation = await getUserLocation();

      // Make API call to your backend server with the user's location
      // const response = await fetch(`http://${ENDPOINT_HOSTNAME_PORT}?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`);
      const response = await fetch(`http://localhost:3007?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`);
      const data = await response.json();

      console.log("Data received from server:", data);

      // Check if location data is present before updating the UI
      if (data.location) {
        locationElement.textContent = `Location: ${data.location.addressLocality}, ${data.location.addressCountry}`;
      } else {
        locationElement.textContent = "Location: Unknown";
      }

      // Check if weather data is present before updating the UI
      if (data.weatherData) {
        temperatureElement.textContent = `Temperature: ${data.weatherData.temperature}°C`;
      } else {
        temperatureElement.textContent = "Temperature: Unknown";
      }
      ``;
      // Hide spinner after getting location and weather data
      spinner.style.display = "none";

      // Enable the OpenAI button after getting location and weather data
      document.getElementById("getOpenAIDescription").disabled = false;
    } catch (error) {
      console.error(error);
      // Hide spinner in case of an error
      spinner.style.display = "none";
    }
  });

  // Button click event listener for getting OpenAI description
  const getOpenAIDescriptionButton = document.getElementById(
    "getOpenAIDescription"
  );
  getOpenAIDescriptionButton.addEventListener("click", async () => {
    try {
      // Show spinner while fetching OpenAI description
      spinner.style.display = "block";

      // Make sure to fetch the OpenAI response first
      const userLocation = await getUserLocation();
      const response = await fetchOpenAIResponse(userLocation);

      // Check if OpenAI response data is present before updating the UI
      if (response.openaiResponse) {
        openaiResponseElement.textContent = response.openaiResponse;
      } else {
        openaiResponseElement.textContent = "OpenAI Response: Unknown";
      }
    } catch (error) {
      console.error(error);
    } finally {
      // Hide spinner after fetching OpenAI description
      spinner.style.display = "none";
    }
  });
});

async function fetchOpenAIResponse(userLocation) {
  try {
    // Your code to fetch OpenAI response
    // const response = await fetch(`http://${ENDPOINT_HOSTNAME_PORT}?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`);
    const response = await fetch(`http://localhost:3007?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    throw error; // Propagate the error
  }
}

async function getUserLocation() {
  return new Promise((resolve, reject) => {
    // Check if the geolocation API is available in the browser
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error);
          // If there's an error, provide a default or sample location
          resolve({
            latitude: 0.0,
            longitude: 0.0,
          });
        }
      );
    } else {
      // Geolocation is not supported, provide a default or sample location
      resolve({
        latitude: 0.0,
        longitude: 0.0,
      });
    }
  });
}

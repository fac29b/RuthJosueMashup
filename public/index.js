const toggleSwitch = document.querySelector("input");
const spinner = document.querySelector(".spinner");
console.log(spinner)
const weatherContainer = document.querySelector("#weather-container")
const body = document.querySelector("body");
toggleSwitch.addEventListener("change", function() {
  const body = document.querySelector("body");
  toggleSwitch.checked ? (weatherContainer.style.backgroundColor = "grey") : (weatherContainer.style.backgroundColor = "white");
});

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Use the browser's geolocation API to get the user's location
    const userLocation = await getUserLocation();

    // Make API call to your backend server with the user's location
    const response = await fetch(`http://localhost:3007?latitude=${userLocation.latitude}&longitude=${userLocation.longitude}`);
    const data = await response.json();

    console.log('Data received from server:', data);

    // Update the UI with weather information and OpenAI response
    const locationElement = document.getElementById('location');
    const temperatureElement = document.getElementById('temperature');
    const openaiResponseElement = document.getElementById('openai-response');

    // Check if location data is present before updating the UI
    if (data.location) {
      locationElement.textContent = `Location: ${data.location.addressLocality}, ${data.location.addressCountry}`;
    } else {
      locationElement.textContent = 'Location: Unknown';
    }

    // Check if weather data is present before updating the UI
    if (data.weatherData) {
      temperatureElement.textContent = `Temperature: ${data.weatherData.temperature}°C`;
    } else {
      temperatureElement.textContent = 'Temperature: Unknown';
    }

    // Check if OpenAI response data is present before updating the UI
    if (data.openaiResponse) {
      openaiResponseElement.textContent = `OpenAI Response: ${data.openaiResponse}`;
      spinner.style.display = "none";
    } else {
      openaiResponseElement.textContent = 'OpenAI Response: Unknow';
    }

  } catch (error) {
    console.error(error);
  }
});


async function getUserLocation() {
  return new Promise((resolve, reject) => {
    // Check if the geolocation API is available in the browser
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error(error);
          // If there's an error, provide a default or sample location
          resolve({
            latitude: 0.0,
            longitude: 0.0
          });
        }
      );
    } else {
      // Geolocation is not supported, provide a default or sample location
      resolve({
        latitude: 0.0,
        longitude: 0.0
      });
    }
  });
}

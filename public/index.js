
document.addEventListener('DOMContentLoaded', async () => {
  try {
      // Make API call to your backend server
      const response = await fetch('http://localhost:3003');
      const weatherData = await response.json();

      // Update the UI with weather information
      const locationElement = document.getElementById('location');
      const temperatureElement = document.getElementById('temperature');

      locationElement.textContent = `Location: ${weatherData.location}`;
      temperatureElement.textContent = `Temperature: ${weatherData.temperature}°C`;
  } catch (error) {
      console.error(error);
  }
});

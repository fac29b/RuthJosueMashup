

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Make API call to your backend server
    const response = await fetch('http://localhost:3003');
    const data = await response.json();

    // Update the UI with weather information and OpenAI response
    const locationElement = document.getElementById('location');
    const temperatureElement = document.getElementById('temperature');
    const openaiResponseElement = document.getElementById('openai-response');

    locationElement.textContent = `Location: ${data.location.city}`;
    // Assuming temperature is a property of weatherData
    temperatureElement.textContent = `Temperature: ${data.weatherData.temperature}°C`;

    // Display OpenAI response
    openaiResponseElement.textContent = `OpenAI Response: ${data.openaiResponse}`;
    // Display OpenAI response
openaiResponseElement.textContent = `OpenAI Response: ${JSON.stringify(data.openaiResponse)}`;


  } catch (error) {
    console.error(error);
  }
});

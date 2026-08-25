const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherDisplay = document.getElementById('weather-display');
const errorMessage = document.getElementById('error-message');

// Weather Code Interpretation Map (WMO Code Standard)
const wmoCodes = {
  0: 'Clear Sky',
  1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
  45: 'Foggy', 48: 'Depositing Rime Fog',
  51: 'Light Drizzle', 53: 'Moderate Drizzle', 55: 'Dense Drizzle',
  61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
  71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
  95: 'Thunderstorm'
};

async function fetchWeather(city) {
  try {
    errorMessage.classList.add('hidden');
    
    // Step 1: Geocoding (Convert city name to Latitude/Longitude)
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`);
    const geoData = await geoRes.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error('City not found');
    }

    const { latitude, longitude, name, country_code } = geoData.results[0];

    // Step 2: Fetch Current Weather
    const weatherRes = await fetch(`https://open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`);
    const weatherData = await weatherRes.json();

    // Step 3: Update UI
    document.getElementById('city-name').textContent = name;
    document.getElementById('country-code').textContent = country_code || '';
    document.getElementById('temperature').textContent = Math.round(weatherData.current.temperature_2m);
    document.getElementById('humidity').textContent = `${weatherData.current.relative_humidity_2m}%`;
    document.getElementById('wind-speed').textContent = `${weatherData.current.wind_speed_10m} km/h`;
    
    const condition = wmoCodes[weatherData.current.weather_code] || 'Unspecified';
    document.getElementById('weather-condition').textContent = condition;

    weatherDisplay.classList.remove('hidden');
  } catch (error) {
    weatherDisplay.classList.add('hidden');
    errorMessage.classList.remove('hidden');
  }
}

searchBtn.addEventListener('click', () => {
  const city = cityInput.value.trim();
  if (city) fetchWeather(city);
});

cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const city = cityInput.value.trim();
    if (city) fetchWeather(city);
  }
});
import React, { useState } from 'react';
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

function WelcomePage() {
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null); // Move this here!
    
    const fetchWeatherData = async (locationQuery) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${locationQuery}&appid=${apiKey}&units=metric`
        );
        const weatherData = await response.json();
        console.log("Weather data:", weatherData);
        return weatherData;
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };
    
    const handleSearch = async () => {
      console.log("Searching for:", location);
      const data = await fetchWeatherData(location);
      setWeatherData(data);
    };
    
  return (
    <div className="welcome-page">
      <h1>Ahoy Matey! Fated tides have washed ye int' Mermaid's Cove! </h1>
      <p>The place to get all your weather and tide information you'll need before embarking on your treasure hunt.</p>
      <p>Where be ye searching for treasure today?</p>
      <input
        type="text"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        placeholder="City, Country"
      />
      <button onClick={handleSearch}>
        Set Sail!
      </button>
      {weatherData && (
        <div>
          <h2>Weather in {weatherData.name}</h2>
          <p>Temperature: {weatherData.main.temp}°C</p>
          <p>Feels like: {weatherData.main.feels_like}°C</p>
          <p>Description: {weatherData.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}
export default WelcomePage;
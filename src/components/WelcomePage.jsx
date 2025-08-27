import React, { useState } from 'react';
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

function WelcomePage() {
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [isCelsius, setIsCelsius] = useState(true);
    const [forecastData, setForecastData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const convertTemp = (temp) => {
      if (isCelsius) {
        return Math.round(temp);
      } else {
        return Math.round((temp * 9/5) + 32);
      }
    };
    
    const fetchWeatherData = async (locationQuery) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${locationQuery}&appid=${apiKey}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error(`City not found: ${response.status}`);
        }
        
        const weatherData = await response.json();
        console.log("Weather data:", weatherData);
        return weatherData;
      } catch (error) {
        console.error("Error fetching weather:", error);
        throw error; // Re-throw so handleSearch can catch it
      }
    };
    
    const fetchForecastData = async (locationQuery) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${locationQuery}&appid=${apiKey}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error(`Forecast not found: ${response.status}`);
        }
        
        const forecast = await response.json();
        console.log("Forecast data:", forecast);
        return forecast;
      } catch (error) {
        console.error("Error fetching forecast:", error);
        throw error;
      }
    };
    
    const handleSearch = async () => {
      if (!location.trim()) {
        setError("Please enter a city name");
        return;
      }
      
      setIsLoading(true);
      setError(null);
      setWeatherData(null);
      setForecastData(null);
      
      try {
        console.log("Searching for:", location);
        const weatherData = await fetchWeatherData(location);
        const forecastData = await fetchForecastData(location);
        setWeatherData(weatherData);
        setForecastData(forecastData);
      } catch (error) {
        setError("City not found. Please check the spelling, remember to use commas, and try again.");
        console.error("Error details:", error.message);
      } finally {
        setIsLoading(false);
      }
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
      
      {isLoading && <p>Searching for treasure...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {weatherData && (
        <div>
          <h2>Weather in {weatherData.name}</h2>
          
          <div style={{ margin: '10px 0' }}>
            <label>
              °C
              <input 
                type="checkbox" 
                checked={!isCelsius} 
                onChange={() => setIsCelsius(!isCelsius)}
              />
              °F
            </label>
          </div>
          
          <p>Temperature: {convertTemp(weatherData.main.temp)}°{isCelsius ? 'C' : 'F'}</p>
          <p>Feels like: {convertTemp(weatherData.main.feels_like)}°{isCelsius ? 'C' : 'F'}</p>
          <p>Description: {weatherData.weather[0].description}</p>

          {/* 5-Day Forecast */}
{forecastData && (
  <div style={{ marginTop: '20px' }}>
    <h3>5-Day Forecast</h3>
    <div>
      {forecastData.list
        .filter((item, index) => index % 8 === 0) // Every 8th item = every 24 hours
        .slice(0, 5)
        .map((item, index) => (
          <div key={index} style={{ border: '1px solid #ccc', margin: '5px', padding: '10px' }}>
            <p><strong>{new Date(item.dt * 1000).toLocaleDateString()}</strong></p>
            <p>Temp: {convertTemp(item.main.temp)}°{isCelsius ? 'C' : 'F'}</p>
            <p>{item.weather[0].description}</p>
          </div>
        ))}
    </div>
  </div>
)}
        </div>
      )}
    </div>
  );
}

export default WelcomePage;
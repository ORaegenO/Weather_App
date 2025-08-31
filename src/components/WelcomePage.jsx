import React, { useState } from 'react';
const apiKey = import.meta.env.VITE_WEATHER_API_KEY;

function WelcomePage() {
    // All state variables first
    const [location, setLocation] = useState('');
    const [weatherData, setWeatherData] = useState(null);
    const [isCelsius, setIsCelsius] = useState(true);
    const [forecastData, setForecastData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Utility functions
    // Convert temperature based on user preference
    const convertTemp = (temp) => {
      if (isCelsius) {
        return Math.round(temp);
      } else {
        return Math.round((temp * 9/5) + 32);
      }
    };
    
    // Calculate moon phase
    const getMoonPhase = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      
      const c = Math.floor((month < 3) ? year - 1 : year);
      const e = Math.floor((month < 3) ? month + 12 : month);
      const jd = Math.floor((365.25 * (c + 4716))) + Math.floor((30.6001 * (e + 1))) + day - 1524.5;
      
      const daysSinceNew = ((jd - 2451549.5) + 14.77) % 29.53;
      
      if (daysSinceNew < 1.84566) return "🌑 New Moon";
      else if (daysSinceNew < 5.53699) return "🌒 Waxing Crescent";
      else if (daysSinceNew < 9.22831) return "🌓 First Quarter";
      else if (daysSinceNew < 12.91963) return "🌔 Waxing Gibbous";  
      else if (daysSinceNew < 16.61096) return "🌕 Full Moon";
      else if (daysSinceNew < 20.30228) return "🌖 Waning Gibbous";
      else if (daysSinceNew < 23.99361) return "🌗 Last Quarter";
      else return "🌘 Waning Crescent";
    };
    
    // API functions for coordinates
    const fetchWeatherByCoords = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        
        if (!response.ok) {
          throw new Error(`Weather not found: ${response.status}`);
        }
        
        const weatherData = await response.json();
        console.log("Weather data:", weatherData);
        return weatherData;
      } catch (error) {
        console.error("Error fetching weather:", error);
        throw error;
      }
    };
    
    const fetchForecastByCoords = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
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
    
    // API functions for city search
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
        throw error;
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
    
    // Event handlers
    const getCurrentLocation = () => {
      if (navigator.geolocation) {
        setIsLoading(true);
        setError(null);
        setWeatherData(null);
        setForecastData(null);
        
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const weatherData = await fetchWeatherByCoords(latitude, longitude);
              const forecastData = await fetchForecastByCoords(latitude, longitude);
              setWeatherData(weatherData);
              setForecastData(forecastData);
            } catch (error) {
              console.log("Geolocation error:", error);
              setError("Couldn't get weather for your location. Try searching manually.");
            } finally {
              setIsLoading(false);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
            setError("Location access denied. Please search manually.");
            setIsLoading(false);
          }
        );
      } else {
        setError("Location services not supported by your browser.");
      }
    };
    
    const handleSearch = async () => {
      if (!location.trim()) {
        setError("Avast! Ye need to mark a destination on yer map first, matey!");
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
        setError("Ye must be pullin' me peg-leg -- that port's make-believe! Best be checkin' yer spellin' or try another.");
        console.error("Error details:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
  return (
    <div className="welcome-page">
      <div className="content-container">
        <h1>Avast, ye Matey!</h1>
        <h2>Yer luck be true — ye've found the Deckhand's Weather Charts.</h2>
        <p>The skies 'n seas be charted fer ye — today's fate an' five suns yet followin', with winds, the moon, an' all the portents ye need.</p>
        <p>Where be ye searchin' fer treasure today?</p>
        
        // Search section
        <div className="search-section">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City, Country"
          />
          <button onClick={handleSearch}>
            Heave ho, ye landlubber!
          </button>
          <button onClick={getCurrentLocation}>
            Use My Location
          </button>
        </div>
        
        {isLoading && <p className="loading-message">Consulting the sea witches... 🗺️</p>}
        {error && <p className="error-message">{error}</p>}
        
        {weatherData && (
          <div className="weather-container">
            <h2>Weather in {weatherData.name}</h2>
            
            // Temperature toggle
            <div className="temp-toggle">
              <span>°C</span>
              <input 
                type="checkbox" 
                checked={!isCelsius} 
                onChange={() => setIsCelsius(!isCelsius)}
              />
              <span>°F</span>
            </div>
            
            // Current weather info
            <div className="weather-info">
              <p>Temperature: {convertTemp(weatherData.main.temp)}°{isCelsius ? 'C' : 'F'}</p>
              <p>Feels like: {convertTemp(weatherData.main.feels_like)}°{isCelsius ? 'C' : 'F'}</p>
              <p>Description: {weatherData.weather[0].description}</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
            </div>

            <div className="maritime-section">
              <h4>Maritime Conditions</h4>
              <div className="maritime-info">
                <p>Wind: {weatherData.wind?.speed ? (weatherData.wind.speed * 3.6).toFixed(1) : 'N/A'} km/h {weatherData.wind?.deg !== undefined ? `from ${weatherData.wind.deg}°` : ''}</p>
                <p>Visibility: {weatherData.visibility ? 
                  weatherData.visibility >= 10000 ? 'Excellent (10+ km)' : `${(weatherData.visibility / 1000).toFixed(1)} km`
                  : 'N/A'}</p>
                <p>Sunrise: {new Date((weatherData.sys.sunrise + weatherData.timezone) * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', timeZone: 'UTC'})}</p>
                <p>Sunset: {new Date((weatherData.sys.sunset + weatherData.timezone) * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', timeZone: 'UTC'})}</p>
                <p>Moon Phase: {getMoonPhase()}</p>
              </div>
            </div>

            {forecastData && (
              <div className="forecast-section">
                <h3>5-Day Forecast</h3>
                <div className="forecast-grid">
                  {forecastData.list
                    .filter((item, index) => index % 8 === 0)
                    .slice(0, 5)
                    .map((item, index) => (
                      <div key={index} className="forecast-day">
                        <strong>{new Date(item.dt * 1000).toLocaleDateString()}</strong>
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
    </div>
  );
}

export default WelcomePage;
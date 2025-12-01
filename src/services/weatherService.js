// Weather service for fetching weather forecasts
// Using OpenWeatherMap API for weather data

const WEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const WEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Check if event is within forecast range (5 days for OpenWeatherMap free tier)
export const isWithinForecastRange = (eventDate) => {
  const now = new Date();
  const fiveDaysFromNow = new Date(now.getTime() + (5 * 24 * 60 * 60 * 1000));
  const eventDateTime = new Date(eventDate);
  
  return eventDateTime >= now && eventDateTime <= fiveDaysFromNow;
};

// Get weather forecast for a specific location and date
export const getWeatherForecast = async (lat, lon, eventDate) => {
  if (!WEATHER_API_KEY) {
    console.warn('OpenWeather API key not configured');
    return null;
  }

  try {
    // Check if event is within forecast range (5 days for free tier)
    const now = new Date();
    const eventDateTime = new Date(eventDate);
    const daysUntilEvent = Math.ceil((eventDateTime - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilEvent < 0 || daysUntilEvent > 5) {
      // Event is in the past or beyond 5-day forecast range
      return null;
    }

    // Use 5-day forecast API
    const response = await fetch(
      `${WEATHER_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Find forecast closest to event time
    const eventTimestamp = eventDateTime.getTime();
    let closestForecast = null;
    let minTimeDiff = Infinity;

    data.list.forEach(forecast => {
      const forecastTime = new Date(forecast.dt * 1000).getTime();
      const timeDiff = Math.abs(eventTimestamp - forecastTime);
      
      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        closestForecast = forecast;
      }
    });

    if (closestForecast) {
      return {
        temperature: Math.round(closestForecast.main.temp),
        feelsLike: Math.round(closestForecast.main.feels_like),
        humidity: closestForecast.main.humidity,
        description: closestForecast.weather[0].description,
        icon: closestForecast.weather[0].icon,
        windSpeed: Math.round(closestForecast.wind.speed),
        precipitation: closestForecast.rain ? closestForecast.rain['3h'] || 0 : 0,
        cloudiness: closestForecast.clouds.all,
        forecastTime: new Date(closestForecast.dt * 1000)
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    return null;
  }
};

// Get current weather for immediate events (today)
export const getCurrentWeather = async (lat, lon) => {
  if (!WEATHER_API_KEY) {
    return null;
  }

  try {
    const response = await fetch(
      `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      windSpeed: Math.round(data.wind.speed),
      cloudiness: data.clouds.all,
      isCurrentWeather: true
    };
  } catch (error) {
    console.error('Error fetching current weather:', error);
    return null;
  }
};

// Get weather icon URL
export const getWeatherIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};
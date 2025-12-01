import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Chip,
  Skeleton,
  Alert
} from '@mui/material';
import { 
  Cloud, 
  WbSunny, 
  Grain,
  Air,
  Opacity,
  Thermostat
} from '@mui/icons-material';
import { 
  getWeatherForecast, 
  getCurrentWeather, 
  getWeatherIconUrl, 
  isWithinForecastRange 
} from '../services/weatherService';

const WeatherForecast = ({ latitude, longitude, eventDate, eventTitle }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!latitude || !longitude || !eventDate) {
        setLoading(false);
        return;
      }

      // Only show weather for events within 5-day forecast range
      if (!isWithinForecastRange(eventDate)) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const now = new Date();
        const eventDateTime = new Date(eventDate);
        const isToday = eventDateTime.toDateString() === now.toDateString();

        let weatherData;
        if (isToday) {
          weatherData = await getCurrentWeather(latitude, longitude);
        } else {
          weatherData = await getWeatherForecast(latitude, longitude, eventDate);
        }

        setWeather(weatherData);
      } catch (err) {
        console.error('Weather fetch error:', err);
        setError('Unable to load weather forecast');
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude, eventDate]);

  if (loading) {
    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" gutterBottom color="text.secondary">
          Weather Forecast
        </Typography>
        <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
          <CardContent sx={{ py: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <Skeleton variant="circular" width={50} height={50} />
              </Grid>
              <Grid item xs={9}>
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="80%" />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info" size="small">
          Weather forecast unavailable
        </Alert>
      </Box>
    );
  }

  if (!weather) {
    // Check if event is beyond forecast range and show helpful message
    if (eventDate && !isWithinForecastRange(eventDate)) {
      const eventDateTime = new Date(eventDate);
      const now = new Date();
      const daysUntilEvent = Math.ceil((eventDateTime - now) / (1000 * 60 * 60 * 24));
      
      if (daysUntilEvent > 5 && daysUntilEvent <= 14) {
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom color="text.secondary">
              Weather Forecast
            </Typography>
            <Alert severity="info" size="small">
              Weather forecast available up to 5 days in advance. Check back closer to the event date.
            </Alert>
          </Box>
        );
      }
    }
    return null; // Don't show anything if no weather data
  }

  const getWeatherIcon = (iconCode) => {
    // Map OpenWeather icons to Material-UI icons as fallback
    const iconMap = {
      '01d': WbSunny, '01n': WbSunny,
      '02d': Cloud, '02n': Cloud,
      '03d': Cloud, '03n': Cloud,
      '04d': Cloud, '04n': Cloud,
      '09d': Grain, '09n': Grain,
      '10d': Grain, '10n': Grain,
      '11d': Grain, '11n': Grain,
      '13d': Grain, '13n': Grain,
      '50d': Cloud, '50n': Cloud,
    };
    
    const IconComponent = iconMap[iconCode] || Cloud;
    return IconComponent;
  };

  const WeatherIcon = getWeatherIcon(weather.icon);

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2" gutterBottom color="text.secondary">
        {weather.isCurrentWeather ? 'Current Weather' : 'Weather Forecast'}
      </Typography>
      <Card variant="outlined" sx={{ bgcolor: 'grey.50' }}>
        <CardContent sx={{ py: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={3} sx={{ textAlign: 'center' }}>
              {weather.icon ? (
                <img 
                  src={getWeatherIconUrl(weather.icon)} 
                  alt={weather.description}
                  style={{ width: 50, height: 50 }}
                />
              ) : (
                <WeatherIcon sx={{ fontSize: 50, color: 'text.secondary' }} />
              )}
            </Grid>
            <Grid item xs={9}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                <Typography variant="h6" component="span">
                  {weather.temperature}°F
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Feels like {weather.feelsLike}°F
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 1, textTransform: 'capitalize' }}>
                {weather.description}
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                <Chip 
                  icon={<Air />} 
                  label={`Wind ${weather.windSpeed} mph`} 
                  size="small" 
                  variant="outlined"
                />
                <Chip 
                  icon={<Opacity />} 
                  label={`${weather.humidity}% humidity`} 
                  size="small" 
                  variant="outlined"
                />
                {weather.precipitation > 0 && (
                  <Chip 
                    icon={<Grain />} 
                    label={`${weather.precipitation}" rain`} 
                    size="small" 
                    variant="outlined"
                    color="primary"
                  />
                )}
              </Box>
              
              {weather.forecastTime && !weather.isCurrentWeather && (
                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                  Forecast for {weather.forecastTime.toLocaleDateString()} {weather.forecastTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Typography>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default WeatherForecast;
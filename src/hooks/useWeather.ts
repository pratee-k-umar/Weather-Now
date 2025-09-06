import { useState, useCallback } from "react";

interface WeatherData {
  temperature: number;
  windSpeed: number;
  weatherCode: number;
  humidity: number;
}

interface CachedWeatherData {
  data: WeatherData;
  timestamp: number;
}

export const useWeather = () => {
  const [isLoading, setIsLoading] = useState(false);
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  const getStoredWeatherData = useCallback((lat: number, lon: number) => {
    const key = `weatherData_${lat}_${lon}`;
    const storedData = localStorage.getItem(key);
    if (!storedData) return null;

    const cachedData: CachedWeatherData = JSON.parse(storedData);
    const now = new Date().getTime();

    if (now - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }
    return null;
  }, [CACHE_DURATION]);

  const fetchWeatherData = useCallback(async (
    latitude: number,
    longitude: number
  ): Promise<WeatherData | null> => {
    try {
      // Check cache first
      const cachedData = getStoredWeatherData(latitude, longitude);
      if (cachedData) {
        console.log("Using cached weather data");
        return cachedData;
      }

      setIsLoading(true);
      const weather_data = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
      );
      const weather_json = await weather_data.json();

      const newWeatherData: WeatherData = {
        temperature: weather_json.current_weather.temperature,
        windSpeed: weather_json.current_weather.windspeed,
        weatherCode: weather_json.current_weather.weathercode,
        humidity: weather_json.current_weather.humidity || 50,
      };

      // Store in localStorage with timestamp
      const cacheData: CachedWeatherData = {
        data: newWeatherData,
        timestamp: new Date().getTime(),
      };
      localStorage.setItem(
        `weatherData_${latitude}_${longitude}`,
        JSON.stringify(cacheData)
      );

      return newWeatherData;
    } catch (err) {
      console.error("Error fetching weather:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [getStoredWeatherData]);

  return { fetchWeatherData, isLoading };
};

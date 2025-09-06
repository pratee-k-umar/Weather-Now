import { useState, useEffect } from "react";
import { useWeather } from "./useWeather";

export const useWeatherByLocation = (place: any | null) => {
  const [locationDetails, setLocationDetails] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchWeatherData } = useWeather();

  useEffect(() => {
    const fetchAndSetData = async (lat: number, lon: number) => {
      const weather = await fetchWeatherData(lat, lon);
      if (weather) {
        setWeatherData(weather);
      } else {
        setError("Could not fetch weather data.");
      }
    };

    setIsLoading(true);
    setError(null);

    if (place) {
      // MODE 1: A place object was provided.
      setLocationDetails(place.display_name);

      // If the place object already has the weather data, use it directly.
      if (place.weather) {
        setWeatherData(place.weather);
        setIsLoading(false);
      } else {
        // Otherwise, fetch it (this is a fallback).
        fetchAndSetData(parseFloat(place.lat), parseFloat(place.lon)).finally(() =>
          setIsLoading(false)
        );
      }
    } else {
      // MODE 2: No place provided. Use geolocation.
      if (!navigator.geolocation) {
        setError("Geolocation is not supported.");
        setIsLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchAndSetData(latitude, longitude);

          try {
            const response = await fetch(
              `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9af3f0061e8043b69670120f30fa57a1`
            );
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const c = data.results[0].components;
              const locationString = `${c.city || c.town || c.village}, ${
                c.country
              }`;
              setLocationDetails(locationString);
            }
          } catch (err) {
            console.error("Could not fetch location name", err);
          }

          setIsLoading(false);
        },
        (err) => {
          setError(err.message);
          setIsLoading(false);
        }
      );
    }
  }, [place, fetchWeatherData]);

  return { weatherData, locationDetails, isLoading, error };
};


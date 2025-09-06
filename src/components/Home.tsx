import { useState, useEffect } from "react";

interface HomeProps {
  is24Hour: boolean;
}

interface CachedWeatherData {
  data: any;
  timestamp: number;
}

export default function Home({ is24Hour }: HomeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationDetails, setLocationDetails] = useState(null);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  useEffect(() => {
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const timeLocale = is24Hour ? "en-GB" : "en-US";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        },
        (err) => {
          setError(err.message);
          setPlaceName("Could not retrieve location.");
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setPlaceName("Geolocation not supported.");
    }
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=9af3f0061e8043b69670120f30fa57a1`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.results && data.results.length > 0) {
            const components = data.results[0].components;
            setLocationDetails({
              city: components.city || components.town || components.village,
              state: components.state,
              country: components.country,
            });
          }
        })
        .catch((err) => console.error("Error fetching location details:", err));
    }
  }, [latitude, longitude]);

  const getTimeComponents = () => {
    return {
      hours: currentTime
        .toLocaleTimeString(timeLocale, {
          hour: "2-digit",
          hour12: !is24Hour,
        })
        .split(" ")[0]
        .replace(/^0/, "")
        .padStart(2, "0"),

      minutes: currentTime
        .toLocaleTimeString(timeLocale, {
          minute: "2-digit",
        })
        .padStart(2, "0"),

      seconds: currentTime
        .toLocaleTimeString(timeLocale, {
          second: "2-digit",
        })
        .padStart(2, "0"),

      period: !is24Hour
        ? currentTime.toLocaleTimeString("en-US", { hour12: true }).slice(-2)
        : "",
    };
  };

  const getStoredWeatherData = () => {
    const storedData = localStorage.getItem("weatherData");
    if (!storedData) return null;

    const cachedData: CachedWeatherData = JSON.parse(storedData);
    const now = new Date().getTime();

    // Check if cache is still valid (less than 5 minutes old)
    if (now - cachedData.timestamp < CACHE_DURATION) {
      return cachedData.data;
    }
    return null;
  };

  useEffect(() => {
    const fetchWeather = async () => {
      if (!latitude || !longitude) return;

      // Check cache first
      const cachedData = getStoredWeatherData();
      if (cachedData) {
        console.log("Using cached weather data");
        setWeatherData(cachedData);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const weather_data = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`
        );
        const weather_json = await weather_data.json();

        const newWeatherData = {
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
        localStorage.setItem("weatherData", JSON.stringify(cacheData));

        setWeatherData(newWeatherData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching weather:", err);
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  const getWeatherIcon = (code: any) => {
    if (code === 0) return "clear_day";
    if (code === 1) return "partly_cloudy_day";
    if (code >= 2 && code <= 3) return "cloud";
    if (code >= 45 && code <= 48) return "foggy";
    if (code >= 51 && code <= 67) return "rainy";
    if (code >= 71 && code <= 77) return "snowy";
    if (code >= 80 && code <= 82) return "rainy";
    if (code >= 85 && code <= 86) return "snowy";
    if (code >= 95 && code <= 99) return "thunderstorm";
    return "clear_day";
  };

  const getWeatherSummary = (weatherData: any) => {
    const shortDescriptions: { [key: number]: string } = {
      0: "Clear and bright skies",
      1: "Partly cloudy vibes today",
      2: "Clouds taking over",
      3: "Total cloud coverage",
      45: "Foggy conditions ahead",
      48: "Watch for freezing fog",
      51: "Light drizzle happening",
      53: "Steady drizzle now",
      55: "Heavy drizzle alert",
      61: "Light rain falling",
      63: "Steady rain pouring",
      65: "Heavy rain incoming",
      71: "Light snow falling",
      73: "Moderate snow coming down",
      75: "Heavy snow alert",
      77: "Snow grains in air",
      80: "Light rain showers here",
      81: "Moderate showers now",
      82: "Heavy rain pouring down",
      85: "Light snow showers today",
      86: "Heavy snow falling now",
      95: "Thunder in the air",
      96: "Thunder with light hail",
      99: "Severe storm warning",
    };

    return shortDescriptions[weatherData.weatherCode] || "Weather is changing";
  };
  return (
    <div>
      <div className="p-5 flex justify-between items-center">
        <div className="flex gap-5">
          <div className="flex flex-col">
            <span className="text-[100px] font-extrabold leading-[80px]">
              {getTimeComponents().hours}
            </span>
            <span className="text-[100px] font-extrabold leading-[80px]">
              {getTimeComponents().minutes}
            </span>
          </div>
          <div className="mt-5 mb-1 flex flex-col justify-between">
            {!is24Hour && (
              <span className="text-[40px] font-extrabold self-start leading-[30px]">
                {getTimeComponents().period}
              </span>
            )}
            <p className="text-[40px] font-extrabold self-start leading-[30px]">
              {getTimeComponents().seconds}
            </p>
          </div>
        </div>
        <div className="rounded-full">
          {weatherData && (
            <img
              src={`weather_icons/${getWeatherIcon(
                weatherData.weatherCode
              )}.png`}
              alt="weather icon"
              className="brightness-0 w-30"
            />
          )}
        </div>
      </div>
      <div className="mx-5 my-10 leading-none">
        {weatherData ? (
          <p className="text-[100px]">{getWeatherSummary(weatherData)}</p>
        ) : (
          <p>{isLoading ? "Loading weather..." : "No Data Available"}</p>
        )}
      </div>
      <div className="mx-5 my-10">
        {weatherData ? (
          <div className="flex justify-between items-center leading-none">
            <p className="text-[70px]">{weatherData.temperature}°C</p>
            <div>
              <div className="flex items-center gap-1">
                <img
                  src="weather_icons/humidity_low.png"
                  alt="humidity_icon"
                  className="brightness-0 w-5"
                />
                <p className="text-xl font-bold">{weatherData.humidity}%</p>
              </div>
              <div className="flex items-center gap-1">
                <img
                  src="weather_icons/wind.png"
                  className="w-5"
                  alt="wind_icon"
                />
                <p className="text-xl font-bold">
                  {weatherData.windSpeed} km/h
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p>{isLoading ? "Loading weather..." : "No Data Avaliable"}</p>
        )}
      </div>
      <div className="mx-5">
        {locationDetails ? (
          <div className="text-[65px] font-medium leading-none">
            <p>{locationDetails.city},</p>
            <p>{locationDetails.state},</p>
            <p>{locationDetails.country}</p>
          </div>
        ) : (
          <p>{error ? error : "Getting location..."}</p>
        )}
      </div>
    </div>
  );
}

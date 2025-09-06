import { useState, useEffect } from "react";
import { useWeather } from "../hooks/useWeather";
import { useWeatherByLocation } from "../hooks/useWeatherByLocation";

interface HomeProps {
  is24Hour: boolean;
  selectedPlace?: any | null;
}

export default function Home({ is24Hour, selectedPlace = null }: HomeProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { weatherData, locationDetails, isLoading, error } =
    useWeatherByLocation(selectedPlace);

  useEffect(() => {
    let timerId: number | undefined;
    if (!selectedPlace) {
      timerId = setInterval(() => setCurrentTime(new Date()), 1000);
    }
    return () => clearInterval(timerId);
  }, [selectedPlace]);

  const getTimeComponents = () => {
    const timeToDisplay =
      selectedPlace && weatherData?.time
        ? new Date(weatherData.time)
        : currentTime;

    const timeLocale = is24Hour ? "en-GB" : "en-US";

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

      period:
        !is24Hour && !selectedPlace
          ? timeToDisplay
              .toLocaleTimeString("en-US", { hour12: true })
              .slice(-2)
          : !is24Hour && selectedPlace
          ? new Date(weatherData?.time)
              .toLocaleTimeString("en-US", { hour12: true, timeZone: "UTC" })
              .slice(-2)
          : "",
    };
  };

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
            <p>{locationDetails}</p>
          </div>
        ) : (
          <p>{error ? error : "Getting location..."}</p>
        )}
      </div>
    </div>
  );
}

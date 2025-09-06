import { useEffect, useState } from "react";
import { useWeather } from "../hooks/useWeather";

interface Place {
  display_name: string;
  lat: string;
  lon: string;
}

interface PlaceWithWeather extends Place {
  weather?: {
    temperature: number;
    weatherCode: number;
    windSpeed: number;
    humidity: number;
  };
}

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState<PlaceWithWeather[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { fetchWeatherData } = useWeather();

  useEffect(() => {
    let isActive = true;
    const fetchPlaces = async () => {
      if (!searchQuery.trim() || searchQuery.length < 3) {
        setPlaces([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            searchQuery
          )}&format=json&limit=5`
        );
        const data: PlaceWithWeather[] = await response.json();

        const placesWithWeather = await Promise.all(
          data.map(async (place) => {
            const weather = await fetchWeatherData(
              parseFloat(place.lat),
              parseFloat(place.lon)
            );
            return { ...place, weather };
          })
        );

        if (isActive) {
          setPlaces(placesWithWeather);
          setIsSearching(false);
        }
      } catch (error) {
        console.error("Error fetching places:", error);
        if (isActive) setIsSearching(false);
      }
    };
    const timeoutId = setTimeout(fetchPlaces, 600);
    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [fetchWeatherData, searchQuery]);

  return (
    <div>
      <div className="m-5">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full bg-transparent text-xl placeholder:text-xl placeholder:text-black/50 border border-slate-200 rounded-4xl pl-5 pr-28 py-3 transition duration-300 ease focus:outline-none shadow-xl"
          />
          {isSearching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="animate-spin h-5 w-5 border-2 border-black border-t-transparent rounded-full"></div>
            </div>
          )}
        </div>

        {searchQuery.length > 0 && searchQuery.length < 3 && (
          <p className="mt-2 text-gray-600">
            Please enter at least 3 characters...
          </p>
        )}

        <div className="mt-4 space-y-2">
          {places.map((place, index) => (
            <div
              key={index}
              className="p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <p className="font-medium">{place.display_name}</p>
              {place.weather && (
                <div className="mt-2 text-sm text-gray-600 grid grid-cols-3 gap-2">
                  <p>{place.weather.temperature}°C</p>
                  <p>{place.weather.windSpeed} km/h</p>
                  <p>{place.weather.humidity}%</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

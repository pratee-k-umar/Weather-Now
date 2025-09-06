import { useEffect, useState } from "react";
import { useWeather } from "../hooks/useWeather";
import Home from "./Home";

interface SearchProps {
  is24Hour: boolean;
}

export default function Search({ is24Hour }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [places, setPlaces] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { fetchWeatherData } = useWeather();

  const [selectedPlace, setSelectedPlace] = useState<any | null>(() => {
    const savedPlace = localStorage.getItem("selectedPlace");
    return savedPlace ? JSON.parse(savedPlace) : null;
  });

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setPlaces([]);
      return;
    }

    let isActive = true;
    const fetchPlaces = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            searchQuery
          )}&format=json&limit=5`
        );
        const data = await response.json();

        // Now, fetch weather for each place
        const placesWithWeather = await Promise.all(
          data.map(async (place: any) => {
            const weather = await fetchWeatherData(
              parseFloat(place.lat),
              parseFloat(place.lon)
            );
            return { ...place, weather }; // Attach weather data to the place object
          })
        );

        if (isActive) {
          setPlaces(placesWithWeather);
        }
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        if (isActive) {
          setIsSearching(false);
        }
      }
    };

    const timeoutId = setTimeout(fetchPlaces, 600);

    return () => {
      isActive = false;
      clearTimeout(timeoutId);
    };
  }, [searchQuery, fetchWeatherData]);

  const handleSelectPlace = (place: any) => {
    localStorage.setItem("selectedPlace", JSON.stringify(place));
    setSelectedPlace(place);
  };

  if (selectedPlace) {
    return (
      <div>
        <button
          onClick={() => {
            setSelectedPlace(null);
            localStorage.removeItem("selectedPlace");
          }}
          className="m-5 p-2 border border-slate-300 rounded-lg hover:bg-slate-100"
        >
          &larr; Back to Search
        </button>
        <Home is24Hour={is24Hour} selectedPlace={selectedPlace} />
      </div>
    );
  }

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
              onClick={() => handleSelectPlace(place)}
              className="p-4 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <p className="font-medium w-5/6">{place.display_name}</p>
                {place.weather ? (
                  <p className="font-bold text-lg text-gray-700">
                    {place.weather.temperature}°C
                  </p>
                ) : (
                  <div className="h-5 w-5 animate-spin border-2 border-black border-t-transparent rounded-full"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


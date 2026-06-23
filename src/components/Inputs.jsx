import { useState } from "react";
import { BiCurrentLocation } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";

const Inputs = ({ setQuery, units, setUnits }) => {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (city.trim()) {
      setQuery({ q: city.trim() });
      setCity("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords;
          // Reverse geocode using Open-Meteo
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );
          const data = await res.json();
          const cityName =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.county;
          if (cityName) setQuery({ q: cityName });
        },
        () => alert("Location access denied.")
      );
    }
  };

  const handleUnitToggle = (selectedUnit) => {
    if (selectedUnit !== units) setUnits(selectedUnit);
  };

  return (
    <div className="flex flex-row justify-center my-6">
      <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search by City..."
          className="text-gray-700 text-xl font-light p-2 w-4/6 shadow-xl bg-amber-50 rounded-xl capitalize focus:outline-none placeholder:lowercase"
        />
        <IoIosSearch
          size={40}
          onClick={handleSearch}
          className="cursor-pointer transition ease-out hover:scale-125"
        />
        <BiCurrentLocation
          size={40}
          onClick={handleLocation}
          className="cursor-pointer transition ease-out hover:scale-125"
        />
      </div>

      <div className="flex flex-row ml-4 items-center justify-center">
        <button
          onClick={() => handleUnitToggle("metric")}
          className={`text-2xl font-medium transition ease-out hover:scale-125 ${
            units === "metric" ? "underline font-bold" : ""
          }`}
        >
          °C
        </button>
        <p className="text-2xl font-medium mx-1">|</p>
        <button
          onClick={() => handleUnitToggle("imperial")}
          className={`text-2xl font-medium transition ease-out hover:scale-125 ${
            units === "imperial" ? "underline font-bold" : ""
          }`}
        >
          °F
        </button>
      </div>
    </div>
  );
};

export default Inputs;
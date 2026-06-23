import { useState, useEffect } from "react";
import Inputs from "./components/Inputs";
import TopButtons from "./components/TopButtons";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import Forecast from "./components/Forecast";
import getFormattedWeatherData from "./services/weatherService";

const App = () => {
  const [query, setQuery] = useState({ q: "Delhi" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      try {
        const cityName = query.q;
        const data = await getFormattedWeatherData(cityName, units);
        setWeather(data);
      } catch (err) {
        setError(err.message || "City not found. Please try again.");
        setWeather(null);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [query, units]);

  const bgClass =
    weather?.is_day === 0
      ? "from-indigo-900 to-blue-900"
      : "from-cyan-600 to-blue-700";

  return (
    <div
      className={`mx-auto max-w-7xl mt-4 py-5 px-32 bg-linear-to-br shadow-xl shadow-gray-400 ${bgClass} text-white`}
    >
      <TopButtons setQuery={setQuery} />
      <Inputs setQuery={setQuery} units={units} setUnits={setUnits} />

      {loading && (
        <div className="flex justify-center items-center py-20 text-xl">
          Loading weather data…
        </div>
      )}

      {error && (
        <div className="flex justify-center items-center py-10 text-red-300 text-lg">
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && weather && (
        <>
          <TimeAndLocation weather={weather} />
          <TempAndDetails weather={weather} />
          <Forecast title="3-Hour Step Forecast" data={weather.hourlyForecast} />
          <Forecast title="Daily Forecast" data={weather.dailyForecast} />
        </>
      )}
    </div>
  );
};

export default App;
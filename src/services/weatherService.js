import { DateTime } from "luxon";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

// Open-Meteo weather code → description + icon mapping
const WMO_CODES = {
  0:  { description: "Clear Sky",          icon: "01d" },
  1:  { description: "Mainly Clear",       icon: "01d" },
  2:  { description: "Partly Cloudy",      icon: "02d" },
  3:  { description: "Overcast",           icon: "04d" },
  45: { description: "Fog",               icon: "50d" },
  48: { description: "Icy Fog",           icon: "50d" },
  51: { description: "Light Drizzle",     icon: "09d" },
  53: { description: "Moderate Drizzle",  icon: "09d" },
  55: { description: "Dense Drizzle",     icon: "09d" },
  61: { description: "Slight Rain",       icon: "10d" },
  63: { description: "Moderate Rain",     icon: "10d" },
  65: { description: "Heavy Rain",        icon: "10d" },
  71: { description: "Slight Snow",       icon: "13d" },
  73: { description: "Moderate Snow",     icon: "13d" },
  75: { description: "Heavy Snow",        icon: "13d" },
  80: { description: "Slight Showers",    icon: "09d" },
  81: { description: "Moderate Showers",  icon: "09d" },
  82: { description: "Violent Showers",   icon: "09d" },
  95: { description: "Thunderstorm",      icon: "11d" },
  99: { description: "Thunderstorm+Hail", icon: "11d" },
};

// Returns Open-Meteo's CDN icon URL (works without API key)
const iconUrl = (code, isDay) => {
  const entry = WMO_CODES[code] || { icon: "01d" };
  const iconBase = isDay === 0 ? entry.icon.replace("d", "n") : entry.icon;
  return `https://openweathermap.org/img/wn/${iconBase}@2x.png`;
};

const getWeatherDescription = (code) =>
  (WMO_CODES[code] || { description: "Unknown" }).description;

const getWeatherData = async (cityName) => {
  // Step 1: geocode
  const geoRes = await fetch(`${GEO_URL}?name=${encodeURIComponent(cityName)}&count=1`);
  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("City not found");
  }

  const { latitude, longitude, name, country, timezone } = geoData.results[0];

  // Step 2: fetch weather
  const url = new URL(WEATHER_URL);
  url.search = new URLSearchParams({
    latitude,
    longitude,
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "weather_code",
      "is_day",
    ].join(","),
    hourly: [
      "temperature_2m",
      "weather_code",
    ].join(","),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "weather_code",
    ].join(","),
    timezone: "auto",
    forecast_days: 6,
  });

  const weatherRes = await fetch(url);
  if (!weatherRes.ok) throw new Error("Failed to fetch weather data");

  const weatherData = await weatherRes.json();
  return { ...weatherData, cityName: name, country, timezone };
};

const getFormattedWeatherData = async (cityName, units = "metric") => {
  const data = await getWeatherData(cityName);

  const {
    current: {
      temperature_2m: tempC,
      apparent_temperature: feels_likeC,
      relative_humidity_2m: humidity,
      wind_speed_10m: windKmh,
      weather_code,
      is_day,
      time: dt,
    },
    daily: {
      temperature_2m_max,
      temperature_2m_min,
      sunrise,
      sunset,
      weather_code: daily_codes,
      time: dailyTimes,
    },
    hourly: {
      temperature_2m: hourlyTemps,
      weather_code: hourlyCodes,
      time: hourlyTimes,
    },
    cityName: name,
    country,
    timezone,
  } = data;

  const toF = (c) => Math.round(c * 9 / 5 + 32);
  const convert = (c) => units === "imperial" ? toF(c) : Math.round(c);
  const unitSuffix = units === "imperial" ? "°F" : "°C";

  // Format local time
  const localTime = DateTime.fromISO(dt, { zone: timezone });
  const formattedTime = localTime.toFormat("cccc, dd LLLL yyyy | 'Local time:' HH:mm");

  // Next 5 hourly forecasts from current hour
  const now = DateTime.fromISO(dt, { zone: timezone });
  const hourlyForecast = [];
  for (let i = 0; i < hourlyTimes.length && hourlyForecast.length < 5; i++) {
    const t = DateTime.fromISO(hourlyTimes[i], { zone: timezone });
    if (t > now) {
      hourlyForecast.push({
        title: t.toFormat("HH:mm"),
        temp: `${convert(hourlyTemps[i])}${unitSuffix}`,
        icon: iconUrl(hourlyCodes[i], 1),
      });
    }
  }

  // Daily forecast (skip today = index 0)
  const dailyForecast = dailyTimes.slice(1, 6).map((dateStr, i) => {
    const d = DateTime.fromISO(dateStr, { zone: timezone });
    return {
      title: d.toFormat("ccc"),
      temp: `${convert(temperature_2m_max[i + 1])}/${convert(temperature_2m_min[i + 1])}${unitSuffix}`,
      icon: iconUrl(daily_codes[i + 1], 1),
    };
  });

  // Format sunrise/sunset in local time
  const fmtTime = (iso) =>
    DateTime.fromISO(iso, { zone: timezone }).toFormat("hh:mm a");

  return {
    temp: `${convert(tempC)}${unitSuffix}`,
    feels_like: `${convert(feels_likeC)}${unitSuffix}`,
    temp_min: `${convert(temperature_2m_min[0])}${unitSuffix}`,
    temp_max: `${convert(temperature_2m_max[0])}${unitSuffix}`,
    humidity: `${humidity}%`,
    wind: `${units === "imperial" ? Math.round(windKmh * 0.621) : Math.round(windKmh)} ${units === "imperial" ? "mph" : "km/h"}`,
    weather: getWeatherDescription(weather_code),
    icon: iconUrl(weather_code, is_day),
    is_day,
    formattedTime,
    name,
    country,
    sunrise: fmtTime(sunrise[0]),
    sunset: fmtTime(sunset[0]),
    hourlyForecast,
    dailyForecast,
  };
};

export default getFormattedWeatherData;
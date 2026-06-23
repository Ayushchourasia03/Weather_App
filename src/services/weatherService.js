const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";

const getWeatherData = async (cityName) => {
  // Step 1: Get coordinates from city name
  const geoRes = await fetch(`${GEO_URL}?name=${cityName}&count=1`);
  const geoData = await geoRes.json();

  if (!geoData.results || geoData.results.length === 0) {
    throw new Error("City not found");
  }

  const { latitude, longitude, name, country, timezone } = geoData.results[0];

  // Step 2: Get weather using coordinates
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
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
    ].join(","),
    timezone: "auto",
  });

  const weatherRes = await fetch(url);
  if (!weatherRes.ok) throw new Error("Failed to fetch weather data");

  const weatherData = await weatherRes.json();

  return { ...weatherData, cityName: name, country, timezone };
};

// Open-Meteo uses weather codes instead of descriptions
// Reference: https://open-meteo.com/en/docs#weathervariables
const getWeatherDescription = (code) => {
  const descriptions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Icy fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight showers",
    81: "Moderate showers",
    82: "Violent showers",
    95: "Thunderstorm",
    99: "Thunderstorm with hail",
  };
  return descriptions[code] || "Unknown";
};

const formatCurrent = (data) => {
  const {
    current: {
      temperature_2m: temp,
      apparent_temperature: feels_like,
      relative_humidity_2m: humidity,
      wind_speed_10m: speed,
      weather_code,
      is_day,
      time: dt,
    },
    daily: {
      temperature_2m_max: [temp_max],
      temperature_2m_min: [temp_min],
      sunrise: [sunrise],
      sunset: [sunset],
    },
    cityName: name,
    country,
    timezone,
  } = data;

  return {
    temp,
    feels_like,
    temp_min,
    temp_max,
    humidity,
    speed,
    weather: getWeatherDescription(weather_code),
    is_day,
    dt,
    name,
    country,
    sunrise,
    sunset,
    timezone,
  };
};

const getFormattedWeatherData = async (cityName) => {
  const data = await getWeatherData(cityName);
  const formattedCurrentWeather = formatCurrent(data);
  return formattedCurrentWeather;
};

export default getFormattedWeatherData;
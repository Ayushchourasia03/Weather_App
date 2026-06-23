import { FaReact } from "react-icons/fa";
import Inputs from "./components/Inputs";
import TopButtons from "./components/TopButtons";
import TimeAndLocation from "./components/TimeAndLocation";
import TempAndDetails from "./components/TempAndDetails";
import Forecast from "./components/Forecast";
import getWeatherData from "./services/weatherService";

const App = () => {

  const getWeather = async () => {
    const data = await getWeatherData('berlin');
    console.log(data);
  };

  getWeather();

  return (
    <div className="mx-auto max-w-7xl mt-4 py-5 px-32 bg-linear-to-br shadow-xl shadow-gray-400 from-cyan-600 to-blue-700">
      <TopButtons />
      <Inputs />

      <TimeAndLocation />
      <TempAndDetails />
      <Forecast />
      <Forecast />
    </div>
  )
}

export default App
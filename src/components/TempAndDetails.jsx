import { FaThermometerEmpty, FaWind } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { GiSunset, GiSunrise } from "react-icons/gi";
import { IoIosArrowDropup, IoIosArrowDropdown } from "react-icons/io";

const TempAndDetails = ({ weather }) => {
  const {
    temp,
    feels_like,
    humidity,
    wind,
    weather: description,
    icon,
    temp_min,
    temp_max,
    sunrise,
    sunset,
  } = weather;

  const verticalDetails = [
    { id: 1, Icon: FaThermometerEmpty, title: "Real Feel", value: feels_like },
    { id: 2, Icon: WiHumidity, title: "Humidity", value: humidity },
    { id: 3, Icon: FaWind, title: "Wind", value: wind },
  ];

  const horizontalDetails = [
    { id: 1, Icon: GiSunrise, title: "Sunrise", value: sunrise },
    { id: 2, Icon: GiSunset, title: "Sunset", value: sunset },
    { id: 3, Icon: IoIosArrowDropup, title: "High", value: temp_max },
    { id: 4, Icon: IoIosArrowDropdown, title: "Low", value: temp_min },
  ];

  return (
    <div>
      <div className="flex items-center justify-center py-6 text-xl text-cyan-300">
        <p>{description}</p>
      </div>

      <div className="flex flex-row justify-between items-center py-3">
        <img src={icon} alt={description} className="w-20" />
        <p className="text-5xl">{temp}</p>
        <div className="flex flex-col space-y-3 items-start">
          {verticalDetails.map(({ id, Icon, title, value }) => (
            <div key={id} className="flex font-light text-sm items-center justify-center">
              <Icon size={18} className="mr-1" />
              {`${title}: `}
              <span className="font-medium ml-1">{value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-row items-center justify-center space-x-10 text-sm py-3">
        {horizontalDetails.map(({ id, Icon, title, value }) => (
          <div key={id} className="flex flex-row items-center">
            <Icon size={30} />
            <p className="font-light ml-1">
              {`${title}: `}
              <span className="font-medium ml-1">{value}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TempAndDetails;
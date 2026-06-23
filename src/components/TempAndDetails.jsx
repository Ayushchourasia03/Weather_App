import { FaThermometerEmpty } from "react-icons/fa";
import { WiHumidity } from "react-icons/wi";
import { FaWind } from "react-icons/fa";
import { GiSunset } from "react-icons/gi";
import { GiSunrise } from "react-icons/gi";
import { IoIosArrowDropup } from "react-icons/io";
import { IoIosArrowDropdown } from "react-icons/io";

const TempAndDetails = () => {

const verticalDetails = [
    {
        id:1,
        Icon : FaThermometerEmpty,
        title: "Real Feel",
        value :"22",
    },
     {
        id:2,
        Icon : WiHumidity,
        title: "Humidity",
        value :"36%",
    },
     {
        id:3,
        Icon : FaWind,
        title: "Wind",
        value :"11 km/hr",
    }
];

    const horizontalDetails = [
    {
        id:1,
        Icon : GiSunrise,
        title: "Sunrise",
        value :"5:30 AM",
    },
     {
        id:2,
        Icon : GiSunset,
        title: "Sunset",
        value :"7:49 PM",
    },
     {
        id:3,
        Icon : IoIosArrowDropup,
        title: "High",
        value :"37°",
    },
    {
        id:4,
        Icon : IoIosArrowDropdown,
        title: "Low",
        value :"7°",
    }
]

  return (
    <div>
        <div className="flex items-center justify-center py-6 text-xl text-cyan-300" >
            <p>Rain</p>
        </div>


        <div className="flex flex-row justify-between items-center py-3 ">
            <img src="http://openweathermap.org/img/wn/01d@2x.png" 
            alt="weather icon"
            className="w-20" 
            />
            <p className="text-5xl ">34°</p>
            <div className="flex flex-col space-y-3 items-start ">
                {
                    verticalDetails.map(({id, Icon, title, value})=>(
                        <div key={id} className="flex font-light text-sm items-center justify-center ">
                    <Icon size={18} className="mr-1" />
                    {`${title}: `} 
                    <span className="font-medium ml-1 ">{value} </span>
                </div>
                    ))
                }
                  
            </div>
        </div>

                <div className="flex flex-row items-center justify-center space-x-10 text-sm py-3 ">
                    {
                        horizontalDetails.map(({id, Icon, title, value}) =>(
                         <div key={id} className="flex flex-row items-center ">
                                <Icon size={30} />
                                <p className="font-light ml-1 ">
                                    {`${title}: `} 
                                    <span className="font-medium ml-1 ">{value} </span>
                                </p>
                    </div>   
                        ))
                    }


                    
                </div>



    </div>
  )
}

export default TempAndDetails
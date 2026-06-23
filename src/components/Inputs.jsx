import { BiCurrentLocation } from "react-icons/bi";
import { IoIosSearch } from "react-icons/io";

const Inputs = () => {
  return (
    <div className="flex flex-row justify-center my-6">
        <div className="flex flex-row w-3/4 items-center justify-center space-x-4">
            <input 
            type='text' 
            placeholder="Search by City..."
            className="text-gray-500 text-xl font-light p-2 w-4/6 shadow-xl bg-amber-50 rounded-xl capitalize focus:outline-none placeholder:lowercase  "
            />

            <IoIosSearch  
            size={40} 
            className= "cursor-pointer transition ease-out hover:scale-125" 
            />
            <BiCurrentLocation 
            size={40} 
            className= "cursor-pointer transition ease-out hover:scale-125"
            />
            </div>

            <div className="flex flex-row ml-4 items-center justify-center ">
                <button className="text-2xl font-medium transition ease-out hover:scale-125">
                    °C
                </button>
                <p className="text-2xl font-medium mx-1">|</p>
                <button className="text-2xl font-medium transition ease-out hover:scale-125">
                    °F
                </button>
            </div>
            </div>
        


  )
}

export default Inputs
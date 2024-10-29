import React, { useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerBody,
} from "./Drawer";
import { toast, Toaster } from "react-hot-toast"; // Import Toastify

// Import images for each city
import Delhi from "../assets/img/Delhi.png";
import Gurugram from "../assets/img/Gurugram.png";
import Noida from "../assets/img/Noida.png";
import Ghaziabad from "../assets/img/Ghaziabad.png";

// Define a mapping of cities to their pincodes
const cityPincodes = {
  Delhi: "110001",
  Gurugram: "122018",
  Noida: "201301",
  Ghaziabad: "201001",
};

const DrawerHero = () => {
  const [selectedLocation, setSelectedLocation] = useState("Choose Location");
  const [pincode, setPincode] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  // Notify when the location is updated
  const notify = () => toast.success("Location updated successfully!");

  const handlePincodeSubmit = () => {
    if (pincode) {
      setSelectedLocation(pincode);
      notify(); // Show toast notification
      setIsOpen(false);
      setPincode(""); // Clear the pincode input
    }
  };

  const handleCitySelect = (city) => {
    const selectedPincode = cityPincodes[city];
    setSelectedLocation(selectedPincode); // Set the selected pincode
    setPincode(selectedPincode); // Update the pincode state
    notify(); // Show toast notification
    setIsOpen(false); // Close the drawer
    setPincode("");
  };

  // Map city names to their respective images
  const cityImages = {
    Delhi,
    Gurugram,
    Noida,
    Ghaziabad,
  };

  return (
    <div className="flex justify-center">
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild className="flex gap-2 items-center">
          <div className="flex items-center">
            <span><CiLocationOn size={30} /></span>
            <div className="flex flex-col">
              <span className="text-[14px] text-gray-600">Delivery to</span>
              <span
                onClick={() => setIsOpen(true)}
                className="text-sm font-bold text-gray-600">
                {selectedLocation}
              </span>
            </div>
          </div>
        </DrawerTrigger>

        <DrawerContent className="">
          <DrawerHeader>
            <DrawerTitle>Select Delivery Location</DrawerTitle>
          </DrawerHeader>

          <DrawerBody className="no-scrollbar">
            <div className="flex flex-col items-center gap-4">
              {/* Pincode Input */}
              <div className="w-full flex items-center border rounded-lg p-2">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter your pincode"
                  className="flex-grow outline-none px-2 text-sm"
                />
                <button
                  onClick={handlePincodeSubmit}
                  className="text-blue-500 text-lg">
                  →
                </button>
              </div>
              <p className="text-sm mt-2">
                Currently selected pincode: <span className="font-bold">{pincode || "None"}</span>
              </p>

              {/* City Selection */}
              <h3 className="mt-4 text-lg font-semibold">Or select your city</h3>
              <div className="grid grid-cols-3 gap-6 mt-2">
                {Object.keys(cityImages).map((city) => (
                  <div key={city} className="flex flex-col items-center">
                    <button
                      onClick={() => handleCitySelect(city)}
                      className="bg-blue-100 rounded-xl flex items-center justify-center h-20 w-20">
                      <img src={cityImages[city]} alt={`${city} icon`} className="w-full h-full object-cover" />
                    </button>
                    <p className="mt-2 text-sm">{city}</p>
                  </div>
                ))}
              </div>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Toast Container */}
      <Toaster />
    </div>
  );
};

export default DrawerHero;

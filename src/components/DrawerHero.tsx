import React, { useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { toast, Toaster } from "react-hot-toast";

// Import images for each city
import Delhi from "../assets/img/Delhi.png";
import Gurugram from "../assets/img/Gurugram.png";
import Noida from "../assets/img/Noida.png";
import Ghaziabad from "../assets/img/Ghaziabad.png";
import { useLocation } from "react-router-dom";

// Define a mapping of cities to their pincodes
const cityPincodes = {
  Delhi: "110001",
  Gurugram: "122018",
  Noida: "201301",
  Ghaziabad: "201001",
};

const DrawerHero = () => {
  const location = useLocation(); // Get the current route
  const [selectedLocation, setSelectedLocation] = useState(
    localStorage.getItem("selectedLocation") || "Choose Location"
  );
  const [pincode, setPincode] = useState("");
  const [showDrawer, setShowDrawer] = useState(true); // Always show drawer on reload

  // Notify when the location is updated
  const notify = () => toast.success("Location updated successfully!");

  const handlePincodeSubmit = () => {
    if (pincode.trim()) {
      setSelectedLocation(pincode);
      notify();
      setShowDrawer(false);
      localStorage.setItem("selectedLocation", pincode); // Save selection
      setPincode(""); // Clear the pincode input
    } else {
      toast.error("Please enter a valid pincode.");
    }
  };

  const handleCitySelect = (city) => {
    const selectedPincode = cityPincodes[city];
    setSelectedLocation(selectedPincode);
    notify();
    setShowDrawer(false);
    localStorage.setItem("selectedLocation", selectedPincode); // Save selection
  };

  // Reset the drawer to show on reload
  useEffect(() => {
    // Check if the user has already visited the home page
    const isFirstVisit = localStorage.getItem("hasVisitedHome");

    if (location.pathname === "/" && !isFirstVisit) {
      setShowDrawer(true);
      localStorage.setItem("hasVisitedHome", "true"); // Mark that the user has visited
    } else {
      setShowDrawer(false);
    }
  }, [location.pathname]);


  // Map city names to their respective images
  const cityImages = {
    Delhi,
    Gurugram,
    Noida,
    Ghaziabad,
  };

  return (
    <div className="flex justify-center">
      {/* Drawer Trigger */}
      <div onClick={() => setShowDrawer(true)} className="md:flex items-center gap-2 cursor-pointer hidden">
        <CiLocationOn size={30} className="hidden md:block" />
        <div className="flex flex-col">
          <span className="text-[8px] md:text-[14px] text-gray-600 hidden md:block">
            Delivery to
          </span>
          <span
            className="text-[8px] md:text-sm font-bold text-gray-600 cursor-pointer"
          >
            {selectedLocation}
          </span>
        </div>
      </div>

      {/* Drawer */}
      {showDrawer && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[500px] relative z-[9999]">
            <h3 className="text-center mb-4 text-lg font-semibold">
              Select Delivery Location
            </h3>
            <div className="flex flex-col items-center gap-4">
              {/* City Selection */}
              <h3 className="mt-4 text-lg font-semibold">
                Select one of the nearby cities we Deliver
              </h3>
              <div className="grid grid-cols-3 gap-6 mt-2">
                {Object.keys(cityImages).map((city) => (
                  <div key={city} className="flex flex-col items-center">
                    <button
                      onClick={() => handleCitySelect(city)}
                      className="border-2 border-gray-500 bg-gray-100 rounded-xl flex items-center justify-center h-20 w-20"
                    >
                      <img
                        src={cityImages[city]}
                        alt={`${city} icon`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                    <p className="mt-2 text-sm">{city}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowDrawer(false)}
              className="absolute top-3 right-6 text-gray-600 text-4xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false}  />
    </div>
  );
};

export default DrawerHero;

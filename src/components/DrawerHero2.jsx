import { useEffect, useState } from "react";
import { CiLocationOn } from "react-icons/ci";
import { toast, Toaster } from "react-hot-toast";

// Import images for each city
import Delhi from "../assets/img/Delhi.png";
import Gurugram from "../assets/img/Gurugram.png";
import Noida from "../assets/img/Noida.png";
import Ghaziabad from "../assets/img/Ghaziabad.png";
import { useLocation } from "react-router-dom";

// Define a mapping of cities to their pincodes
const cityPincodes2 = {
  Delhi: "110001",
  Gurugram: "122018",
  Noida: "201301",
  Ghaziabad: "201001",
};

const DrawerHero2 = () => {
  const location2 = useLocation(); // Get the current route
  const [selectedLocation2, setSelectedLocation2] = useState(
    localStorage.getItem("selectedLocation2") || "Choose Location"
  );
  const [pincode2, setPincode2] = useState("");
  const [showDrawer2, setShowDrawer2] = useState(true); // Always show drawer on reload

  // Notify when the location is updated
  const notify2 = () => toast.success("Location updated successfully!");

  const handlePincodeSubmit2 = () => {
    if (pincode2.trim()) {
      setSelectedLocation2(pincode2);
      notify2();
      setShowDrawer2(false);
      localStorage.setItem("selectedLocation2", pincode2); // Save selection
      setPincode2(""); // Clear the pincode input
    } else {
      toast.error("Please enter a valid pincode.");
    }
  };

  const handleCitySelect2 = (city) => {
    const selectedPincode2 = cityPincodes2[city];
    setSelectedLocation2(selectedPincode2);
    notify2();
    setShowDrawer2(false);
    localStorage.setItem("selectedLocation2", selectedPincode2); // Save selection
  };

  // Reset the drawer to show on reload
  useEffect(() => {
    // Check if the user has already visited the home page
    const isFirstVisit = localStorage.getItem("hasVisitedHome");

    if (location.pathname === "/" && !isFirstVisit) {
      setShowDrawer2(true);
      localStorage.setItem("hasVisitedHome", "true"); // Mark that the user has visited
    } else {
      setShowDrawer2(false);
    }
  }, [location2.pathname]);

  // Map city names to their respective images
  const cityImages2 = {
    Delhi,
    Gurugram,
    Noida,
    Ghaziabad,
  };

  return (
    <div className="md:hidden flex justify-center">
      {/* Drawer Trigger */}
      <div className="md:flex items-center gap-2 hidden">
        <CiLocationOn size={30} className="hidden md:block" />
        <div className="flex flex-col">
          <span className="text-[8px] md:text-[14px] text-gray-600 hidden md:block">
            Delivery to
          </span>
          <span
            onClick={() => setShowDrawer2(true)}
            className="text-[8px] md:text-sm font-bold text-gray-600 cursor-pointer"
          >
            {selectedLocation2}
          </span>
        </div>
      </div>

      {/* Drawer */}
      {showDrawer2 && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[500px] relative">
            <h3 className="text-center mb-4 text-lg font-semibold">
              Select Delivery Location
            </h3>
            <div className="flex flex-col items-center gap-4">
              {/* Pincode Input */}
              {/* <div className="w-full flex items-center border rounded-lg p-2">
                <input
                  type="text"
                  value={pincode2}
                  onChange={(e) => setPincode2(e.target.value)}
                  placeholder="Enter your pincode"
                  className="flex-grow outline-none px-2 text-sm"
                />
                <button
                  onClick={handlePincodeSubmit2}
                  className="text-blue-500 text-lg"
                >
                  →
                </button>
               
              </div>
              <p className="text-sm mt-2">
                Currently selected pincode:{" "}
                <span className="font-bold">{pincode2 || "None"}</span>
              </p>
               */}

              {/* City Selection */}
              <h3 className="mt-4 text-lg font-semibold">
              Select one of the nearby cities we Deliver
              </h3>
              <div className="grid grid-cols-3 gap-6 mt-2">
                {Object.keys(cityImages2).map((city) => (
                  <div key={city} className="flex flex-col items-center">
                    <button
                      onClick={() => handleCitySelect2(city)}
                      className="border-2 border-gray-500 bg-gray-100 rounded-xl flex items-center justify-center h-20 w-20"
                    >
                      <img
                        src={cityImages2[city]}
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
              onClick={() => setShowDrawer2(false)}
              className="absolute top-3 right-6 text-gray-600 text-4xl font-bold"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Toast Container */}
      <Toaster />
    </div>
  );
};

export default DrawerHero2;

/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import storageService from "../service/storage.service";
import { AXIOS_INSTANCE } from "../service";
import { all } from "axios";
import axios from "axios";

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>
      <p className="text-center my-1">{children}</p>

      <button
        onClick={onClose}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Close
      </button>
    </div>
  </div>
);
const Modal2 = ({ title, children, onClose2 }) => (
  <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center   modal2">
    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4 text-center">{title}</h2>
      <p className="text-center my-1">{children}</p>

      <button
        onClick={onClose2}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Close
      </button>
    </div>
  </div>
);

export default function AddressPage({ finalPayment }) {
  // const allowedPincodes = ["110001", "122018", "201301", "201001"];
  const allowedPincodes = [
    "201001", "201014", "201007", "201002", "201005", "201011", "201012",
    "201009", "201005", "201003", "201004", "201010", "201017", "201015",
    "201016", "122002", "122001", "122009", "122505", "122003", "122017",
    "122011", "122018", "122004", "122006", "201301", "201303", "201310",
    "201306", "110018", "110032", "110063", "110006", "110018", "110085",
    "110024", "110026", "110015", "110010", "110048", "110017", "110085",
    "110096", "110018", "110015", "110016", "110064", "110085", "110049",
    "110019", "110051", "110019", "110085", "110085", "110085", "110075",
    "110085", "110015", "110064", "110060", "110005", "110092", "110054",
    "110018", "110091", "110006", "110027", "110059", "110027", "110027",
    "110033", "110048", "110015", "110092", "110041", "110085", "110065",
    "110001", "110020", "110031", "110002", "110083", "110028", "110048",
    "110007", "110085", "110022", "110085", "110085", "110092", "110092",
    "110021", "110019", "110034", "110085", "110091", "110014", "110095",
    "110001", "110092", "110009", "110035", "110017", "110092", "110053",
    "110001", "110091", "110096", "110053", "110030", "110091", "110096"
  ];


  const [showPopup, setShowPopup] = useState(false);
  const [showPopup2, setShowPopup2] = useState(false);

  const [pincode, setPincode] = useState("");

  // Function to extract pincode from address
  const extractPincode = (address) => {
    const pincodeMatch = address.match(/\b\d{6}\b/); // Regex to match a 6-digit number
    return pincodeMatch ? pincodeMatch[0] : null;
  };
  const location = useLocation();
  const { cartTotal, shippingCost, cartItems, apiFetchedAddress } =
    location.state;


  const [modifyAddress, setModifyAddress] = useState({
    flatNo: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pinCode: "",
  }); // Store each field of the custom address separately
  const [isCustomAddress, setIsCustomAddress] = useState(false); // Toggle between fetched and custom address
  const [selectedAddress, setSelectedAddress] = useState(null); // Track whether fetched address is selected
  const user = storageService.get("user");
  const navigate = useNavigate();



  const handlePayment = async () => {
    if (!selectedAddress && !isCustomAddress && !modifyAddress) {
      alert("Please select or enter an address");
      return;
    }
    if (!user) {
      alert("Please login to continue");
      return;
    }

    if (!allowedPincodes.includes(modifyAddress.pinCode || extractPincode(selectedAddress))) {
      setShowPopup2(true);
      return;
    }

    // Concatenate the custom address fields into a single string
    const customAddressString = isCustomAddress
      ? `${modifyAddress.flatNo}, ${modifyAddress.addressLine1}, ${modifyAddress.addressLine2}, ${modifyAddress.city}, ${modifyAddress.state}, ${modifyAddress.pinCode}`
      : null;

    // Determine the address to send
    const addressToSend = isCustomAddress ? customAddressString : selectedAddress;

    // Step 1: Trigger Razorpay Payment Gateway
    const options = {
      key: "rzp_live_gNLh3zWfj9gj0H",
      amount: cartTotal * 100,
      currency: "INR",
      name: "RM RENTAL",
      description: "Rm Rental Payment",
      image: "https://your-logo-url.com/logo.png",
      handler: async (response) => {
        try {
          // Step 2: Verify Payment
          const paymentData = {
            payment_id: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          };

          const verifyResponse = await AXIOS_INSTANCE.post(
            "/order/verifyPayment",
            paymentData
          );

          if (verifyResponse?.data?.success) {
            // Step 3: Create Order in Backend after Payment Success
            const orderResponse = await AXIOS_INSTANCE.post("/create/order", {
              cartTotal,
              shippingCost,
              cartItems,
              address: addressToSend, // Send the selected or custom address
            });

            console.log(orderResponse);

            const orderData = orderResponse?.data;
            if (orderData.success) {
              setModifyAddress({
                flatNo: "",
                addressLine1: "",
                addressLine2: "",
                city: "",
                state: "",
                pinCode: "",
              }); // Clear fields after payment
              navigate("/orderconfirm", {
                state: { orderId: orderData._id },
              });
            } else {
              alert("Order creation failed. Reason: " + orderData.error);
              navigate("/orderfailed");
            }
          } else {
            alert("Payment verification failed");
            navigate("/orderfailed");
          }
        } catch (error) {
          console.error("Payment verification or order creation failed:", error);
          alert("An error occurred during the payment process.");
          // navigate("/orderfailed");
        }
      },
      prefill: {
        name: user?.name,
        email: user?.email,
        contact: "9999999999",
      },
      theme: {
        color: "#6366F1",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };


  const handleSelectAddress = () => {
    const extractedPincode = extractPincode(apiFetchedAddress);

    if (!extractedPincode || !allowedPincodes.includes(extractedPincode)) {
      setShowPopup(true); // Show popup if pincode is not allowed
    } else {
      setSelectedAddress(apiFetchedAddress);
    }

    setModifyAddress({
      flatNo: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pinCode: "",
    });
    setIsCustomAddress(false); // Ensure we're not in custom address mode
  };

  const toggleCustomAddress = () => {
    setIsCustomAddress((prev) => !prev);
    setSelectedAddress(null); // Deselect fetched address when switching to custom
    setModifyAddress({
      flatNo: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pinCode: "",
    }); // Reset the custom address fields when switching
  };

  useEffect(() => {
    const pinCodeMapping = [
      { "area": "Ghaziabad", "pincode": "201001", "state": "Uttar Pradesh" },
      { "area": "Indirapuram", "pincode": "201014", "state": "Uttar Pradesh" },
      { "area": "Mohan Nagar", "pincode": "201007", "state": "Uttar Pradesh" },
      { "area": "Kavi Nagar", "pincode": "201002", "state": "Uttar Pradesh" },
      { "area": "Sahibabad", "pincode": "201005", "state": "Uttar Pradesh" },
      { "area": "Surya Nagar", "pincode": "201011", "state": "Uttar Pradesh" },
      { "area": "Nehru Nagar", "pincode": "201001", "state": "Uttar Pradesh" },
      { "area": "Rajendra Nagar", "pincode": "201005", "state": "Uttar Pradesh" },
      { "area": "Vasundhara", "pincode": "201012", "state": "Uttar Pradesh" },
      { "area": "Model Town", "pincode": "201009", "state": "Uttar Pradesh" },
      { "area": "Kaushambi", "pincode": "201012", "state": "Uttar Pradesh" },
      { "area": "Bhopura", "pincode": "201005", "state": "Uttar Pradesh" },
      { "area": "Pratap Vihar", "pincode": "201009", "state": "Uttar Pradesh" },
      { "area": "Shalimar Garden", "pincode": "201005", "state": "Uttar Pradesh" },
      { "area": "Kamla Nehru Nagar", "pincode": "201002", "state": "Uttar Pradesh" },
      { "area": "Chander Nagar", "pincode": "201011", "state": "Uttar Pradesh" },
      { "area": "Nandgram", "pincode": "201003", "state": "Uttar Pradesh" },
      { "area": "Hindan Residential Area", "pincode": "201004", "state": "Uttar Pradesh" },
      { "area": "Sanjay Nagar", "pincode": "201002", "state": "Uttar Pradesh" },
      { "area": "Vaishali", "pincode": "201010", "state": "Uttar Pradesh" },
      { "area": "Shastri Nagar", "pincode": "201002", "state": "Uttar Pradesh" },
      { "area": "Pandav Nagar Industrial Area", "pincode": "201002", "state": "Uttar Pradesh" },
      { "area": "Harbans Nagar", "pincode": "201001", "state": "Uttar Pradesh" },
      { "area": "Raj Nagar", "pincode": "201002", "state": "Uttar Pradesh" },
      { "area": "Chiranjiv Vihar", "pincode": "201002", "state": "Uttar Pradesh" },
      { "area": "Panchsheel Enclave", "pincode": "201010", "state": "Uttar Pradesh" },
      { "area": "Govind Puram", "pincode": "201013", "state": "Uttar Pradesh" },
      { "area": "Raj Nagar Extension", "pincode": "201017", "state": "Uttar Pradesh" },
      { "area": "Wave City", "pincode": "201015", "state": "Uttar Pradesh" },
      { "area": "Mahurali", "pincode": "201015", "state": "Uttar Pradesh" },
      { "area": "Siddharth Vihar", "pincode": "201009", "state": "Uttar Pradesh" },
      { "area": "Crossing Republik", "pincode": "201016", "state": "Uttar Pradesh" },
      { "area": "Bahrampur", "pincode": "201003", "state": "Uttar Pradesh" },
      { "area": "Ramprastha", "pincode": "201011", "state": "Uttar Pradesh" },
      { "area": "Shalimar Garden Extension 2", "pincode": "201005", "state": "Uttar Pradesh" },
      { "area": "Shalimar Garden Extension 1", "pincode": "201005", "state": "Uttar Pradesh" },
      { "area": "Koyal Enclave", "pincode": "201005", "state": "Uttar Pradesh" },
    
      { "area": "Sector 26", "pincode": "122002", "state": "Haryana" },
      { "area": "Sushant Lok I", "pincode": "122002", "state": "Haryana" },
      { "area": "DLF Phase 2", "pincode": "122002", "state": "Haryana" },
      { "area": "Sector 6", "pincode": "122001", "state": "Haryana" },
      { "area": "DLF Phase 4", "pincode": "122009", "state": "Haryana" },
      { "area": "Sector 95", "pincode": "122505", "state": "Haryana" },
      { "area": "Sector 52A", "pincode": "122003", "state": "Haryana" },
      { "area": "Sector 44", "pincode": "122003", "state": "Haryana" },
      { "area": "Sector 38", "pincode": "122001", "state": "Haryana" },
      { "area": "Sector 32", "pincode": "122001", "state": "Haryana" },
      { "area": "DLF Phase 3", "pincode": "122010", "state": "Haryana" },
      { "area": "Sector 40", "pincode": "122001", "state": "Haryana" },
      { "area": "Sector 60", "pincode": "122011", "state": "Haryana" },
      { "area": "Palam Vihar Extension", "pincode": "122017", "state": "Haryana" },
      { "area": "Sector 26A", "pincode": "122002", "state": "Haryana" },
      { "area": "Sector 61", "pincode": "122011", "state": "Haryana" },
      { "area": "Ashok Vihar Phase II", "pincode": "122001", "state": "Haryana" },
      { "area": "Sector 94", "pincode": "122505", "state": "Haryana" },
      { "area": "Sector 66", "pincode": "122018", "state": "Haryana" },
      { "area": "Palam Vihar", "pincode": "122017", "state": "Haryana" },
      { "area": "Sector 21", "pincode": "122016", "state": "Haryana" },
      { "area": "Ashok Vihar Phase III", "pincode": "122001", "state": "Haryana" },
      { "area": "Sector 110", "pincode": "122017", "state": "Haryana" },
      { "area": "Sector 110A", "pincode": "122017", "state": "Haryana" },
      { "area": "Sector 106", "pincode": "122017", "state": "Haryana" },
      { "area": "Sector 3A", "pincode": "122001", "state": "Haryana" },
      { "area": "Sector 107", "pincode": "122017", "state": "Haryana" },
      { "area": "Sector 10A", "pincode": "122001", "state": "Haryana" },
      { "area": "Sector 37A", "pincode": "122004", "state": "Haryana" },
      { "area": "Sector 37C", "pincode": "122004", "state": "Haryana" },
      { "area": "Sector 37B", "pincode": "122004", "state": "Haryana" },
      { "area": "Sector 93", "pincode": "122505", "state": "Haryana" },
      { "area": "Sector 108", "pincode": "122017", "state": "Haryana" },
      { "area": "Sector 102", "pincode": "122505", "state": "Haryana" },
      { "area": "Sector 111", "pincode": "122017", "state": "Haryana" },
      { "area": "Sector 92", "pincode": "122505", "state": "Haryana" },
      { "area": "Sector 101", "pincode": "122505", "state": "Haryana" },
      { "area": "Sector 23A", "pincode": "122017", "state": "Haryana" },
      { "area": "Sector 68", "pincode": "122018", "state": "Haryana" },
      { "area": "Sector 96", "pincode": "122505", "state": "Haryana" },
      { "area": "Sushant Lok Phase 3", "pincode": "122003", "state": "Haryana" },
      { "area": "Sector 105", "pincode": "122505", "state": "Haryana" },
      { "area": "Sector 98", "pincode": "122505", "state": "Haryana" },
      { "area": "Sector-73", "pincode": "122018", "state": "Haryana" },
      { "area": "Sector-114", "pincode": "122017", "state": "Haryana" },
      { "area": "Sector-74", "pincode": "122004", "state": "Haryana" },
      { "area": "Sector-103", "pincode": "122006", "state": "Haryana" },
      { "area": "Sector-103A", "pincode": "122006", "state": "Haryana" },
      { "area": "Sector-90", "pincode": "122505", "state": "Haryana" },
      { "area": "Sector-70A", "pincode": "122018", "state": "Haryana" },
    
      { "area": "Sector-12", "pincode": "201301", "state": "Uttar Pradesh" },
      { "area": "Sector-11", "pincode": "201301", "state": "Uttar Pradesh" },
      { "area": "Sector-1", "pincode": "201301", "state": "Uttar Pradesh" },
      { "area": "Sector-12A", "pincode": "201301", "state": "Uttar Pradesh" },
      { "area": "Sector-36", "pincode": "201303", "state": "Uttar Pradesh" },
      { "area": "Jaypee Greens", "pincode": "201310", "state": "Uttar Pradesh" },
      { "area": "Sector-3", "pincode": "201301", "state": "Uttar Pradesh" },
      { "area": "Sector-16", "pincode": "201301", "state": "Uttar Pradesh" },
      { "area": "Sector-4", "pincode": "201301", "state": "Uttar Pradesh" },
      { "area": "Noida Extension", "pincode": "201301", "state": "Uttar Pradesh" },
      { "area": "Sector-5", "pincode": "201301", "state": "Uttar Pradesh" },
      { "area": "Sector-10", "pincode": "201301", "state": "Uttar Pradesh" },
      { "area": "Sector-19", "pincode": "201303", "state": "Uttar Pradesh" },
      { "area": "Sector-13", "pincode": "201301", "state": "Uttar Pradesh" },
      { "area": "Sector-29", "pincode": "201301", "state": "Uttar Pradesh" },
      { "area": "Sector-30", "pincode": "201301", "state": "Uttar Pradesh" },
      { "area": "Sector-35", "pincode": "201303", "state": "Uttar Pradesh" },
      { "area": "Sector-15", "pincode": "201301", "state": "Uttar Pradesh" }
    ];
    

    const allowedPincodes = pinCodeMapping.filter((pincode) => pincode.pincode === modifyAddress.pinCode);

    if (allowedPincodes.length > 0) {
      setModifyAddress((prev) => ({ ...prev, city: allowedPincodes[0].area }));
      setModifyAddress((prev) => ({ ...prev, state: allowedPincodes[0].state }));
    }


  }, [modifyAddress.pinCode]);

  return (
    <div className="container mx-auto my-8 px-4 md:px-8 lg:px-10 flex flex-col items-center">
      <h2 className="text-3xl font-semibold mb-6 text-gray-700">
        Select Your Address
      </h2>

      <button
        className="bg-[#fec500] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#e8b942] transition mb-8"
        onClick={toggleCustomAddress}
      >
        {isCustomAddress ? "Use Fetched Address" : "Use Custom Address"}
      </button>

      <div className="flex flex-col items-center w-full max-w-5xl bg-white rounded-lg shadow-lg p-6 ">
        {isCustomAddress ? (
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-4 text-[#fec500]">
              Enter Your New Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label
                  htmlFor="flatNo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Flat / Room No
                </label>
                <input
                  type="text"
                  id="flatNo"
                  value={modifyAddress.flatNo}
                  onChange={(e) =>
                    setModifyAddress((prev) => ({
                      ...prev,
                      flatNo: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="addressLine1"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address Line 1
                </label>
                <input
                  type="text"
                  id="addressLine1"
                  value={modifyAddress.addressLine1}
                  onChange={(e) =>
                    setModifyAddress((prev) => ({
                      ...prev,
                      addressLine1: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="addressLine2"
                  className="block text-sm font-medium text-gray-700"
                >
                  Address Line 2
                </label>
                <input
                  type="text"
                  id="addressLine2"
                  value={modifyAddress.addressLine2}
                  onChange={(e) =>
                    setModifyAddress((prev) => ({
                      ...prev,
                      addressLine2: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="pinCode"
                  className="block text-sm font-medium text-gray-700"
                >
                  Pin Code
                </label>
                <input
                  type="text"
                  id="pinCode"
                  value={modifyAddress.pinCode}
                  onChange={(e) =>
                    setModifyAddress((prev) => ({
                      ...prev,
                      pinCode: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={modifyAddress.pinCode === '110001' ? 'New Delhi' : modifyAddress.pinCode === '122018' ? 'Gurugram' : modifyAddress.pinCode === '201301' ? 'Noida' : modifyAddress.pinCode === '201001' ? 'Ghaziabad' : modifyAddress.city}
                  onChange={(e) =>
                    setModifyAddress((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div className="form-group">
                <label
                  htmlFor="state"
                  className="block text-sm font-medium text-gray-700"
                >
                  State
                </label>
                <input
                  type="text"
                  id="state"
                  value={modifyAddress.pinCode === '110001' ? 'New Delhi' : modifyAddress.pinCode === '122018' ? 'Haryana' : modifyAddress.pinCode === '201301' ? 'Uttar Pradesh' : modifyAddress.pinCode === '201001' ? 'Uttar Pradesh' : modifyAddress.state}
                  onChange={(e) =>
                    setModifyAddress((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>
            {showPopup2 && (
              <Modal2
                title="Pincode Not Serviceable"
                onClose2={() => setShowPopup2(false)}
              >
                <p className="w-[80%] mx-auto">
                  We currently not Serving in your area please update your pincode !!
                </p>
                {/* <p>Your pincode: {pincode || "Not Found"}</p> */}
                <p className="mt-2">Please update your address to proceed.</p>
              </Modal2>
            )}
          </div>
        ) : (
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-4 text-[#fec500]">
              Your Fetched Address
            </h3>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
              <tbody>
                {apiFetchedAddress && (
                  <tr>
                    <td className="py-4 px-6">{apiFetchedAddress}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        className={`px-4 py-2 rounded-lg transition ${selectedAddress === apiFetchedAddress
                          ? "bg-green-500 text-white"
                          : "bg-[#fec500] text-white"
                          } hover:bg-[#e8b942]`}
                        onClick={handleSelectAddress}
                      >
                        {selectedAddress === apiFetchedAddress
                          ? "Selected"
                          : "Select"}
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {showPopup && (
              <Modal
                title="Pincode Not Serviceable"
                onClose={() => setShowPopup(false)}
              >
                <p className="w-[80%] mx-auto">
                  We currently not Serving in your area please update your pincode !!
                </p>
                {/* <p>Your pincode: {pincode || "Not Found"}</p> */}
                <p className="mt-2">Please update your address to proceed.</p>
              </Modal>
            )}
          </div>
        )}
      </div>

      <button
        className={`w-full max-w-md bg-[#fec500] text-white px-6 py-3 rounded-lg shadow-lg hover:bg-[#e8b942] transition mt-6 ${!(
          isCustomAddress &&
          modifyAddress.flatNo &&
          modifyAddress.addressLine1 &&
          modifyAddress.city &&
          modifyAddress.state &&
          modifyAddress.pinCode
        ) && !selectedAddress
          ? "cursor-not-allowed opacity-50"
          : ""
          }`}
        onClick={handlePayment}
        disabled={
          !(
            isCustomAddress &&
            modifyAddress.flatNo &&
            modifyAddress.addressLine1 &&
            modifyAddress.city &&
            modifyAddress.state &&
            modifyAddress.pinCode
          ) && !selectedAddress
        }
      >
        Proceed to Payment
      </button>
    </div>
  );
}

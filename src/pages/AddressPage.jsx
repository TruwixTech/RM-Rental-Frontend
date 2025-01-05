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
  const allowedPincodes = ["110001", "122018", "201301", "201001"];
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

    console.log(cartTotal)
    console.log(shippingCost)
    console.log(cartItems)
    

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

  console.log(modifyAddress);


  const handlePayment = async () => {
    console.log(showPopup);
    if (!selectedAddress && !isCustomAddress && !modifyAddress) {
      alert("Please select or enter an address");
      return;
    }
    if (!user) {
      alert("Please login to continue");
      return;
    }
  
    if (!allowedPincodes.includes(modifyAddress.pinCode)) {
      console.log(showPopup2);
      setShowPopup2(true);
      console.log(showPopup2);
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
      key: "rzp_test_bPKH4b75rXxBKr",
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
    if (modifyAddress.pinCode === "110001") {
      setModifyAddress((prev) => ({ ...prev, city: "New Delhi" }));
      setModifyAddress((prev) => ({ ...prev, state: "New Delhi" }));
    } else if (modifyAddress.pinCode === "122018") {
      setModifyAddress((prev) => ({ ...prev, city: "Gurugram" }));
      setModifyAddress((prev) => ({ ...prev, state: "Haryana" }));
    } else if (modifyAddress.pinCode === "201301") {
      setModifyAddress((prev) => ({ ...prev, city: "Noida" }));
      setModifyAddress((prev) => ({ ...prev, state: "Uttar Pradesh" }));
    } else if (modifyAddress.pinCode === "201001") {
      setModifyAddress((prev) => ({ ...prev, city: "Ghaziabad" }));
      setModifyAddress((prev) => ({ ...prev, state: "Uttar Pradesh" }));
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
                <p>
                  We currently only serve the following pincodes:{" "}
                  {allowedPincodes.join(", ")}.
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
                <p>
                  We currently only serve the following pincodes:{" "}
                  {allowedPincodes.join(", ")}.
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

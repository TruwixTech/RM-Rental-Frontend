/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import storageService from "../service/storage.service";
import { AXIOS_INSTANCE } from "../service";

export default function AddressPage({ finalPayment }) {
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

    // Concatenate the custom address fields into a single string
    const customAddressString = isCustomAddress
      ? `${modifyAddress.flatNo}, ${modifyAddress.addressLine1}, ${modifyAddress.addressLine2}, ${modifyAddress.city}, ${modifyAddress.state}, ${modifyAddress.pinCode}`
      : null;

    // Determine the address to send
    const addressToSend = isCustomAddress
      ? customAddressString
      : selectedAddress;

    // Step 1: Create an order from the backend
    const orderResponse = await AXIOS_INSTANCE.post("/create/order", {
      cartTotal,
      shippingCost,
      cartItems,
      address: addressToSend, // Send the selected or custom address
    });

    const orderData = orderResponse?.data;
    if (!orderData.success) {
      alert("Order creation failed. Reason: " + orderData.error);
      return;
    }

    // Step 2: Trigger Razorpay Payment Gateway
    const options = {
      key: "rzp_test_Lx1DFKJyuWRRZG",
      amount: cartTotal * 100,
      currency: orderData.currency || "INR",
      name: "RM RENTAL",
      description: "Rm Rental Payment",
      image: "https://your-logo-url.com/logo.png",
      order_id: orderData.id,
      handler: async (response) => {
        const paymentData = {
          order_id: orderData._id,
          payment_id: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        };

        const verifyResponse = await AXIOS_INSTANCE.post(
          "/order/verifyPayment",
          paymentData
        );
        if (verifyResponse?.data?.success) {
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
          alert("Payment verification failed");
          navigate("/orderfailed");
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
    setSelectedAddress(apiFetchedAddress); // Set the fetched address string as selected
    setModifyAddress({
      flatNo: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pinCode: "",
    }); // Clear custom address fields if any
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

  return (
    <div className="container mx-auto my-8 px-4 md:px-8 lg:px-10 flex flex-col items-center">
      <h2 className="text-3xl font-semibold mb-6 text-gray-700">
        Select Your Address
      </h2>

      <button
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition mb-8"
        onClick={toggleCustomAddress}
      >
        {isCustomAddress ? "Use Fetched Address" : "Use Custom Address"}
      </button>

      <div className="flex flex-col items-center w-full max-w-5xl bg-white rounded-lg shadow-lg p-6">
        {isCustomAddress ? (
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">
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
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700"
                >
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  value={modifyAddress.city}
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
                  value={modifyAddress.state}
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
            </div>
          </div>
        ) : (
          <div className="w-full">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">
              Your Fetched Address
            </h3>
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow">
              <tbody>
                {apiFetchedAddress && (
                  <tr>
                    <td className="py-4 px-6">{apiFetchedAddress}</td>
                    <td className="py-4 px-6 text-right">
                      <button
                        className={`px-4 py-2 rounded-lg transition ${
                          selectedAddress === apiFetchedAddress
                            ? "bg-green-500 text-white"
                            : "bg-indigo-600 text-white"
                        } hover:bg-indigo-700`}
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
          </div>
        )}
      </div>

      <button
        className={`w-full max-w-md bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-600 transition mt-6 ${
          !(
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

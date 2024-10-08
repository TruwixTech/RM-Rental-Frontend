import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import storageService from "../service/storage.service";
import { AXIOS_INSTANCE } from "../service";

export default function AddressPage({ finalPayment }) {
  const location = useLocation();
  const { cartTotal, shippingCost, cartItems, apiFetchedAddress } =
    location.state;

    console.log(cartTotal)
  const [modifyAddress, setModifyAddress] = useState(""); // Store the custom address as a single string
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

    // Determine the address to send
    const addressToSend = isCustomAddress ? modifyAddress : selectedAddress;

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
          alert("Payment successful");
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
        color: "#F37254",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleSelectAddress = () => {
    setSelectedAddress(apiFetchedAddress); // Set the fetched address string as selected
    setModifyAddress(""); // Clear custom address if any
    setIsCustomAddress(false); // Ensure we're not in custom address mode
  };

  const toggleCustomAddress = () => {
    setIsCustomAddress((prev) => !prev);
    setSelectedAddress(null); // Deselect fetched address when switching to custom
    setModifyAddress(""); // Reset the custom address field when switching
  };

  return (
    <div className="container mx-auto my-4 px-4 md:px-8 lg:px-10 flex flex-col items-center">
      <h2 className="text-2xl font-semibold mb-4">Your Address</h2>

      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
        onClick={toggleCustomAddress}
      >
        {isCustomAddress ? "Use Fetched Address" : "Use Custom Address"}
      </button>

      <div className="flex flex-col items-center w-full max-w-md">
        {isCustomAddress ? (
          <div className="w-full">
            <div className="mt-3 mb-3 font-bold text-center">
              Fill in a New Address
            </div>
            <div className="form-group mb-4">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                value={modifyAddress}
                onChange={(e) => setModifyAddress(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                rows="4"
                placeholder="Enter your address here"
              />
            </div>
          </div>
        ) : (
          <div className="w-full">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">Your Current Address</th>
                  <th className="py-2 px-4 border-b"></th>
                </tr>
              </thead>
              <tbody>
                {apiFetchedAddress && (
                  <tr>
                    <td colSpan={2} className="py-2 px-4 border-b">
                      {apiFetchedAddress}{" "}
                      {/* Display the fetched address as a string */}
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      <button
                        className={`px-4 py-2 rounded transition ${
                          selectedAddress === apiFetchedAddress
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                        } hover:bg-blue-600`}
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
        className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition mt-4 ${
          !(isCustomAddress && modifyAddress) && !selectedAddress
            ? "cursor-not-allowed opacity-50"
            : ""
        }`}
        onClick={handlePayment}
        disabled={!(isCustomAddress && modifyAddress) && !selectedAddress} // Disable if no address is selected or filled
      >
        Proceed to payment
      </button>
    </div>
  );
}

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import storageService from "../service/storage.service";
import { AXIOS_INSTANCE } from "../service";

export default function AddressPage({ finalPayment }) {
  const location = useLocation();
  const { cartTotal, shippingCost, cartItems, apiFetchedAddress } =
    location.state;

    console.log(cartTotal)

  const [modifyAddress, setModifyAddress] = useState(apiFetchedAddress || {});
  const [isCustomAddress, setIsCustomAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const user = storageService.get("user");
  const navigate = useNavigate();

  const handlePayment = async () => {
    if (!modifyAddress.id && !isCustomAddress) {
      alert("Please select or enter an address");
      return;
    }
    if (!user) {
      alert("Please login to continue");
      return;
    }

    // Step 1: Create an order from the backend
    const orderResponse = await AXIOS_INSTANCE.post("/create/order", {
      pincodeTo: modifyAddress.pincode,
      cartTotal,
      shippingCost,
      cartItems,
    });

    const orderData = orderResponse?.data;
    if (!orderData.success) {
      alert("Order creation failed. Reason: " + orderData.error);
      return;
    }

    // Step 2: Trigger Razorpay Payment Gateway
    const options = {
      key: "rzp_test_Lx1DFKJyuWRRZG",
      amount: cartTotal,
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

  const handleSelectAddress = (address) => {
    if (selectedAddressId === address.id) {
      setSelectedAddressId(null);
      setModifyAddress({});
    } else {
      setModifyAddress(address);
      setSelectedAddressId(address.id);
    }
  };

  const toggleCustomAddress = () => {
    setIsCustomAddress(!isCustomAddress);
    // Reset selection if switching to custom address
    if (isCustomAddress) {
      setSelectedAddressId(null); // Deselect fetched address
      setModifyAddress({}); // Clear custom address fields
    }
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
              <label htmlFor="address1">Address Line 1</label>
              <input
                type="text"
                id="address1"
                name="addressLineOne"
                value={modifyAddress.addressLineOne || ""}
                onChange={(e) =>
                  setModifyAddress({
                    ...modifyAddress,
                    addressLineOne: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="address2">Address Line 2</label>
              <input
                type="text"
                id="address2"
                name="addressLineTwo"
                value={modifyAddress.addressLineTwo || ""}
                onChange={(e) =>
                  setModifyAddress({
                    ...modifyAddress,
                    addressLineTwo: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="form-group mb-4">
              <label htmlFor="pincode">Pincode</label>
              <input
                type="text"
                id="pincode"
                name="pincode"
                value={modifyAddress.pincode || ""}
                onChange={(e) =>
                  setModifyAddress({
                    ...modifyAddress,
                    pincode: e.target.value,
                  })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
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
                  <tr key={apiFetchedAddress.id}>
                    <td colSpan={2} className="py-2 px-4 border-b">
                      {apiFetchedAddress}
                    </td>
                    <td className="py-2 px-4 border-b text-right">
                      <button
                        className={`px-4 py-2 rounded transition ${
                          selectedAddressId === apiFetchedAddress.id
                            ? "bg-green-500 text-white"
                            : "bg-blue-500 text-white"
                        } hover:bg-blue-600`}
                        onClick={() => handleSelectAddress(apiFetchedAddress)}
                      >
                        {selectedAddressId === apiFetchedAddress.id
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
          !modifyAddress.id && !isCustomAddress ? "cursor-not-allowed" : ""
        }`}
        onClick={handlePayment}
        disabled={!modifyAddress.id && !isCustomAddress} // Disable the button until an address is selected
      >
        Proceed to payment
      </button>
    </div>
  );
}

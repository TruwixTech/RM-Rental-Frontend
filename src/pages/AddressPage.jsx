import { useEffect, useState } from "react";
import { AXIOS_INSTANCE } from "../service";
import { useNavigate } from "react-router-dom";
import storageService from "../service/storage.service";
import '../assets/csss/AddressPage.css';

export default function AddressPage({ finalPayment }) { 
  const [address, setAddress] = useState([]);
  const [modifyAddress, setModifyAddress] = useState({});
  const user = storageService.get("user");
  const navigate = useNavigate();

  const getAllAddress = async () => {
    try {
      const { data } = await AXIOS_INSTANCE.get("/address");
      setAddress(data?.address);
    } catch (error) {
      console.log(error);
    }
  };

  const updateAddress = async (id) => {
    try {
      const { data } = await AXIOS_INSTANCE.put(`/address/${id}`, {
        ...modifyAddress,
      });
      if (data.success) {
        getAllAddress();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const addAddress = async () => {
    try {
      const { data } = await AXIOS_INSTANCE.post("/address", {
        ...modifyAddress,
      });
      if (data?.success) {
        getAllAddress();
      } else {
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const { data } = await AXIOS_INSTANCE.delete(`/address/${id}`);
      if (data.success) {
        getAllAddress();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async () => {
    if (!modifyAddress.id) {
      alert("Please select an address");
      return;
    }
    if (!user) {
      alert("Please login to continue");
      return;
    }

    // Step 1: Create an order from the backend
    const orderResponse = await AXIOS_INSTANCE.post("/create/order", {
      pincodeTo: modifyAddress.pincode,
    });
    console.log("Order Response:", orderResponse);

    const orderData = orderResponse?.data;
    if (!orderData.success) {
      alert("Order creation failed Reason: " + orderData.error);
      return;
    }

    const amountToRazorpay = (orderData.totalPrice * 100).toFixed(0);

    // Step 2: Trigger Razorpay Payment Gateway
    const options = {
      key: "rzp_test_Lx1DFKJyuWRRZG", // Replace with your Razorpay Key ID
      amount: amountToRazorpay,
      currency: orderData.currency || "INR",
      name: "RM RENTAL",
      description: "Rm Rental Payment",
      image: "https://your-logo-url.com/logo.png", // Optional: Add your logo
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
        name: user?.name, // Optional: Prefill with customer data
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

  useEffect(() => {
    getAllAddress();

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      console.log("Razorpay script loaded successfully.");
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <div className="outertable">
        <table className="table">
          <thead>
            <tr>
              <th>Address Line 1</th>
              <th>Address Line 2</th>
              <th>Pincode</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {address.map((address) => (
              <tr key={address.id}>
                <td>{address.addressLineOne}</td>
                <td>{address.addressLineTwo}</td>
                <td>{address.pincode}</td>
                {finalPayment ? (
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => setModifyAddress(address)}
                    >
                      Select
                    </button>
                  </td>
                ) : (
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => setModifyAddress(address)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteAddress(address.id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="form-group">
          <label htmlFor="address">Address line 1</label>
          <input
            type="text"
            id="address"
            name="address"
            value={modifyAddress.addressLineOne}
            onChange={(e) =>
              setModifyAddress({
                ...modifyAddress,
                addressLineOne: e.target.value,
              })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address line 2</label>
          <input
            type="text"
            id="address"
            name="address"
            value={modifyAddress.addressLineTwo}
            onChange={(e) =>
              setModifyAddress({
                ...modifyAddress,
                addressLineTwo: e.target.value,
              })
            }
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Pincode</label>
          <input
            type="text"
            id="address"
            name="address"
            value={modifyAddress.pincode}
            onChange={(e) =>
              setModifyAddress({ ...modifyAddress, pincode: e.target.value })
            }
          />
        </div>

        {!finalPayment && (
          <button
            className="btn btn-success"
            onClick={() =>
              modifyAddress.id ? updateAddress(modifyAddress.id) : addAddress()
            }
          >
            {modifyAddress.id ? "Update Address" : "Add Address"}
          </button>
        )}
        {finalPayment && (
          <button className="btn btn-success" onClick={handlePayment}>
            Proceed to payment
          </button>
        )}
      </div>
    </>
  );
}

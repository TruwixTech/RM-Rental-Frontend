import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../assets/csss/MyCart.css";
import { deleteProductFromCartAPI, getCartAPI } from "../service/cart.service";
import storageService from "../service/storage.service";
// import { AXIOS_INSTANCE } from "../service";
// import toast from "react-hot-toast";
import userService from "../service/user.service";

const placeholderImageURL =
  "https://cdn.dribbble.com/users/887568/screenshots/3172047/media/725fca9f20d010f19b3cd5411c50a652.gif";

const MyCart = () => {
  const user = storageService.get("user");
  const [userCartData, setUserCartData] = useState({ items: [] });
  const [origins, setOrigins] = useState("");
  const [distanceToShop, setDistanceToShop] = useState(null);
  const [address, setAddress] = useState("");
  const GST_RATE = 0.18;
  const currentDate = new Date();
  const deliveryDate = new Date(currentDate.getTime() + 96 * 60 * 60 * 1000);
  const navigate = useNavigate();

  const day = deliveryDate.getDate();
  const month = deliveryDate.toLocaleString("default", { month: "short" });
  const formattedDeliveryDate = `Delivery by ${day} ${month}`;

  const destinations = "18.532881931761416, 73.85157119570161";

  const getDistance = async () => {
    const distance = await userService.getLocation(origins, destinations);

    setDistanceToShop(distance.data.distance);
    setAddress(distance.data.address);

    
  };

  console.log(distanceToShop);
    console.log(address);
  // Trigger getDistance only after origins is set
  useEffect(() => {
    if (origins) {
      getDistance();
    }
  }, [origins]);

  // Function to get user's current location
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const locationString = `${latitude}, ${longitude}`;
        setOrigins(locationString);
      },
      (error) => {
        console.error("Error getting location", error);
      }
    );
  }, []);

  const handleProductRemove = async (id) => {
    const data = await deleteProductFromCartAPI(user?._id, id);
    if (data) {
      getMyCart();
    }
  };

  const getMyCart = async () => {
    const { data } = await getCartAPI(user?._id);
    if (data && data.items) {
      setUserCartData(data);
    }
  };

  useEffect(() => {
    getMyCart();
  }, []);

  // Calculate the total quantity of items in the cart
  const calculateTotalQuantity = () => {
    return userCartData?.items?.reduce((acc, curr) => {
      return acc + curr.rentOptions.quantity;
    }, 0);
  };

  // Calculate the shipping fee based on the distance and total quantity
  const calculateShippingFee = () => {
    const totalQuantity = calculateTotalQuantity();
    return distanceToShop ? totalQuantity * distanceToShop * 100 : 0;
  };

  const calculateSecurityDeposit = () => {
    return (
      userCartData?.items?.reduce((acc, curr) => {
        const rentPrice = getRentMonthsPrice(
          curr.rentOptions.rentMonthsCount,
          curr.product.rentalOptions
        );
        return acc + (rentPrice || 0) * 2 * curr.rentOptions.quantity; // 2x rent price for security deposit
      }, 0) || 0
    );
  };

  const getRentMonthsPrice = (rentMonthsCount, rentalOptions) => {
    switch (rentMonthsCount) {
      case 3:
        return rentalOptions.rent3Months;
      case 6:
        return rentalOptions.rent6Months;
      case 9:
        return rentalOptions.rent9Months;
      case 12:
        return rentalOptions.rent12Months;
      default:
        return 0; // Return 0 for unrecognized rent months
    }
  };

  const calculateSubtotal = () => {
    return (
      userCartData?.items?.reduce((acc, curr) => {
        const rentPrice = getRentMonthsPrice(
          curr.rentOptions.rentMonthsCount,
          curr.product.rentalOptions
        );
        return acc + (rentPrice || 0) * curr.rentOptions.quantity;
      }, 0) || 0
    );
  };

  const calculateGST = () => {
    const subtotal = calculateSubtotal();
    return subtotal ? subtotal * GST_RATE : 0;
  };

  const calculateTotalPrice = () => {
    const subtotal = calculateSubtotal();
    const gst = calculateGST();
    const deposit = calculateSecurityDeposit();
    const shippingFee = calculateShippingFee();
    return (subtotal || 0) + (gst || 0) + (deposit || 0) + (shippingFee || 0);
  };

  // const handlePayment = async () => {
  //   if (!user) {
  //     alert("Please login to continue");
  //     return;
  //   }

  //   if (userCartData.items.length === 0) {
  //     toast.error("Cart is empty!");
  //   }

  //   const cartTotal = calculateTotalPrice().toFixed(2);
  //   const shippingCost = calculateShippingFee().toFixed(2);
  //   const cartItems = userCartData.items;

  //   // Step 1: Create an order from the backend
  //   const orderResponse = await AXIOS_INSTANCE.post("/create/order", {
  //     pincodeTo: "123123",
  //     cartTotal,
  //     shippingCost,
  //     cartItems,
  //     address,
  //   });
  //   console.log("Order Response:", orderResponse);

  //   const orderData = orderResponse?.data;
  //   if (!orderData.success) {
  //     alert("Order creation failed Reason: " + orderData.error);
  //     return;
  //   }

  //   const amountToRazorpay = cartTotal * 100;

  //   // Step 2: Trigger Razorpay Payment Gateway
  //   const options = {
  //     key: "rzp_test_Lx1DFKJyuWRRZG", // Replace with your Razorpay Key ID
  //     amount: amountToRazorpay,
  //     currency: orderData.currency || "INR",
  //     name: "RM RENTAL",
  //     description: "Rm Rental Payment",
  //     image: "https://your-logo-url.com/logo.png", // Optional: Add your logo
  //     order_id: orderData.id,
  //     handler: async (response) => {
  //       const paymentData = {
  //         order_id: orderData._id,
  //         payment_id: response.razorpay_payment_id,
  //         signature: response.razorpay_signature,
  //       };

  //       const verifyResponse = await AXIOS_INSTANCE.post(
  //         "/order/verifyPayment",
  //         paymentData
  //       );
  //       if (verifyResponse?.data?.success) {
  //         alert("Payment successful");
  //         navigate("/orderconfirm", {
  //           state: { orderId: orderData._id },
  //         });
  //       } else {
  //         alert("Payment verification failed");
  //         navigate("/orderfailed");
  //       }
  //     },
  //     prefill: {
  //       name: user?.name, // Optional: Prefill with customer data
  //       email: user?.email,
  //       contact: "9999999999",
  //     },
  //     theme: {
  //       color: "#F37254",
  //     },
  //   };

  //   const rzp = new window.Razorpay(options);
  //   rzp.open();
  // };

  return (
    <div className="amazon-cart">
      <div className="cart-content flex flex-col md:flex-row">
        <div className="cart-items">
          <div className="shop-heading">
            <h2 className="cart-heading">Shopping Cart</h2>
          </div>
          {userCartData.items.length === 0 ? (
            <div className="empty-cart">
              <img src={placeholderImageURL} alt="Empty Cart" />
              <p>Your Cart is empty.</p>
            </div>
          ) : (
            userCartData.items.map((item) => (
              <div key={item?.product?._id} className="cart-border">
                <div className="cart-item">
                  <div className="image-to-left">
                    <img
                      src={item?.product?.img[0] || placeholderImageURL}
                      alt="Product"
                    />
                  </div>
                  <div className="item-details">
                    <h3>{item?.product?.title}</h3>
                    <p className="sub-title">{item?.product?.sub_title}</p>
                    <p className="price">
                      {`₹ ${
                        getRentMonthsPrice(
                          item?.rentOptions.rentMonthsCount,
                          item?.product?.rentalOptions
                        ) * item?.rentOptions?.quantity
                      } / ${item?.rentOptions.rentMonthsCount} months on rent`}
                    </p>
                    <p>
                      Quantity:{" "}
                      <span className="border rounded-full px-2 m-2 text-black">
                        {item?.rentOptions?.quantity}
                      </span>
                    </p>
                    <p className="delivery">{formattedDeliveryDate}</p>
                  </div>
                  <div className="delete-btn-container">
                    <button
                      className="delete-btn"
                      onClick={() => handleProductRemove(item?.product?._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-overview">
          <div className="cart-header"></div>
          <div className="proceed-container">
            {/* <div className="cart-details">
              <div className="my-2">
                Cart Total | ₹{calculateTotalPrice().toFixed(2) || "0.00"}
              </div>
            </div> */}
            {/* <button
              className={`proceed-btn ${
                userCartData.items.length === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              onClick={() => {
                if (userCartData.items.length !== 0) {
                  navigate("/address/finalPayment", {
                    state: {
                      cartTotal: calculateTotalPrice(), // Sending total price
                      shippingCost: calculateShippingFee(), // Sending shipping fee
                      cartItems: userCartData.items, // Sending cart items
                    },
                  });
                }
              }}
              disabled={userCartData.items.length === 0}
            >
              Proceed <span className="arrow-icon">→</span>
            </button> */}
            {/* <button
              className={`proceed-btn ${
                userCartData.items.length === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              } font-semibold`}
              onClick={handlePayment}
              disabled={userCartData.items.length === 0}
            >
              Pay ₹ {calculateTotalPrice().toFixed(2) || ""} Now <span className="arrow-icon">→</span>
            </button> */}
            <button
              className={`proceed-btn ${
                userCartData.items.length === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              onClick={() => {
                if (userCartData.items.length !== 0) {
                  navigate("/address/finalPayment", {
                    state: {
                      cartTotal: calculateTotalPrice(), // Sending total price
                      shippingCost: calculateShippingFee(), // Sending shipping fee
                      cartItems: userCartData.items, // Sending cart items
                      apiFetchedAddress: address,
                    },
                  });
                }
              }}
              disabled={userCartData.items.length === 0}
            >
              Pay ₹ {calculateTotalPrice().toFixed(2) || ""} Now{" "}
              <span className="arrow-icon">→</span>
            </button>
          </div>

          <div className="summary">
            <h3>Cost Summary</h3>
            {userCartData.items.map((item) => (
              <div key={item?.product?._id} className="rent-cost-breakup">
                <h4>
                  {item?.product?.title} X {item?.rentOptions.quantity}
                </h4>
              </div>
            ))}
            <hr />
            <p>
              <strong>Subtotal:</strong> ₹ {calculateSubtotal().toFixed(2)}
            </p>
            <p>
              <strong>GST (18%):</strong> ₹ {calculateGST().toFixed(2)}
            </p>
            <p>
              <strong>Shipping:</strong> ₹ {calculateShippingFee().toFixed(2)}
            </p>
            <p>
              <strong>Security Deposit:</strong> ₹{" "}
              {calculateSecurityDeposit().toFixed(2)}
            </p>
            <hr />
            <p>
              <strong>Total:</strong> ₹ {calculateTotalPrice().toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCart;

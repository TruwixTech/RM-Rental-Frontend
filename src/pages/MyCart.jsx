import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../assets/csss/MyCart.css";
import {
  deleteProductFromCartAPI,
  getCartAPI,
  // updateCartAPI,
} from "../service/cart.service";
import storageService from "../service/storage.service";

const placeholderImageURL =
  "https://cdn.dribbble.com/users/887568/screenshots/3172047/media/725fca9f20d010f19b3cd5411c50a652.gif";

const MyCart = () => {
  const user = storageService.get("user");
  const [userCartData, setUserCartData] = useState({ items: [] }); // Initialize as an object with an items array
  const GST_RATE = 0.18; // GST
  const DELIVERY_FEE = 100;
  const currentDate = new Date();
  const deliveryDate = new Date(currentDate.getTime() + 96 * 60 * 60 * 1000); // 96 hours in milliseconds

  // Format the delivery date
  const day = deliveryDate.getDate();
  const month = deliveryDate.toLocaleString("default", { month: "short" }); // Short month name
  const formattedDeliveryDate = `Delivery by ${day} ${month}`;
  const navigate = useNavigate();

  // const handleQtyIncrease = async (id) => {
  //   const itemIndex = userCartData?.items?.findIndex(
  //     (item) => item?.product?._id === id
  //   );
  //   if (itemIndex >= 0) {
  //     const updatedItem = { ...userCartData.items[itemIndex] };
  //     updatedItem.rentOptions.quantity += 1; // Increase quantity for the found item

  //     const data = await updateCartAPI({
  //       user: user?._id,
  //       quantity: updatedItem.rentOptions.quantity,
  //       productId: id,
  //       rentMonthsCount: updatedItem.rentOptions.rentMonthsCount, // Pass rentMonthsCount
  //       rentMonths: updatedItem.rentOptions.rentMonths, // Pass rentMonths
  //     });
  //     if (data) {
  //       getMyCart(); // Refresh cart data after update
  //     }
  //   }
  // };

  // const handleQtyDecrease = async (id) => {
  //   const itemIndex = userCartData?.items?.findIndex(
  //     (item) => item?.product?._id === id
  //   );

  //   if (itemIndex >= 0) {
  //     const updatedItem = { ...userCartData.items[itemIndex] };
  //     if (updatedItem.rentOptions.quantity > 1) {
  //       updatedItem.rentOptions.quantity -= 1; // Decrease quantity for the found item

  //       const data = await updateCartAPI({
  //         user: user?._id,
  //         quantity: updatedItem.rentOptions.quantity,
  //         productId: id,
  //         rentMonthsCount: updatedItem.rentOptions.rentMonthsCount, // Pass rentMonthsCount
  //         rentMonths: updatedItem.rentOptions.rentMonths, // Pass rentMonths
  //       });
  //       if (data) {
  //         getMyCart(); // Refresh cart data after update
  //       }
  //     } else {
  //       // If quantity is 1, you might want to remove the item from the cart
  //       const data = await updateCartAPI({
  //         user: user?._id,
  //         quantity: 0, // This will remove the item
  //         productId: id,
  //       });
  //       if (data) {
  //         getMyCart(); // Refresh cart data after update
  //       }
  //     }
  //   }
  // };

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

  useEffect(() => {
    getMyCart();
  }, []);

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

  const calculateSubtotal = () => {
    return (
      userCartData?.items?.reduce((acc, curr) => {
        const rentPrice = getRentMonthsPrice(
          curr.rentOptions.rentMonthsCount,
          curr.product.rentalOptions
        );
        return acc + (rentPrice || 0) * curr.rentOptions.quantity; // Ensure rentPrice is valid
      }, 0) || 0
    ); // Return 0 if subtotal is NaN
  };

  const calculateGST = () => {
    const subtotal = calculateSubtotal();
    return subtotal ? subtotal * GST_RATE : 0; // Return 0 if subtotal is NaN
  };

  const calculateTotalPrice = () => {
    const subtotal = calculateSubtotal();
    const gst = calculateGST();
    return (subtotal || 0) + (gst || 0) + DELIVERY_FEE; // Ensure valid numbers are added
  };

  return (
    <div className="amazon-cart">
      <div className="cart-content">
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
                      src={
                        item?.product?.img[0] ||
                        "https://odoo-community.org/web/image/product.template/3936/image_1024?unique=f578478"
                      }
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
                    <p>Quantity: <span className="border rounded-full px-2 m-2 bg-blue-500 text-white">{item?.rentOptions?.quantity}</span></p>
                    <p className="delivery">{formattedDeliveryDate}</p>
                    {/* <div className="quantity-controls-wrapper">
                      <button
                        className="qty-btn"
                        onClick={() => handleQtyDecrease(item?.product?._id)}
                      >
                        -
                      </button>
                      <span>{item?.rentOptions.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => handleQtyIncrease(item?.product?._id)}
                      >
                        +
                      </button>
                    </div> */}
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

          {/* Proceed Button Above the Summary */}
          <div className="proceed-container">
            <div className="cart-details">
              <h4>
                Cart Total | ₹
                {(calculateTotalPrice() + calculateSecurityDeposit()).toFixed(
                  2
                ) || "0.00"}
                {/* {userCartData.items.reduce(
                  (acc, curr) => acc + curr.rentOptions.quantity,
                  0
                )} */}
              </h4>
            </div>
            <button
              className={`proceed-btn ${
                userCartData.items.length === 0
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              onClick={() => {
                if (userCartData.items.length !== 0) {
                  navigate("/address/finalPayment");
                }
              }}
              disabled={userCartData.items.length === 0} // Disable if the cart is empty
            >
              Proceed <span className="arrow-icon">→</span>
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
              <strong>
                Subtotal (
                {userCartData.items.reduce(
                  (acc, curr) => acc + curr.rentOptions.quantity,
                  0
                )}
                items):{" "}
              </strong>
              ₹ {calculateSubtotal().toFixed(2) || "0.00"}
            </p>
            <p>
              <strong>GST (18%):</strong> ₹{" "}
              {calculateGST().toFixed(2) || "0.00"}
            </p>
            <p>
              <strong>Shipping:</strong> ₹ {DELIVERY_FEE}
            </p>
            <p>
              <strong>Security Deposit:</strong> ₹
              {calculateSecurityDeposit().toFixed(2) || "0.00"}
            </p>
            <p className="total-amount">
              <strong>Total:</strong> ₹{" "}
              {(calculateTotalPrice() + calculateSecurityDeposit()).toFixed(
                2
              ) || "0.00"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyCart;

import { useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../assets/csss/MyCart.css";
import { deleteProductFromCartAPI, getCartAPI, updateNewCartAPI } from "../service/cart.service";
import storageService from "../service/storage.service";
import userService from "../service/user.service";
import { getAllProductsAPI } from "../service/products.service";
import { addToCartAPI } from "../service/cart.service";
import toast from "react-hot-toast";
import axios from "axios";
import { Link } from "react-router-dom";
import { AXIOS_INSTANCE } from "../service";
import { RotatingLines } from 'react-loader-spinner'
const placeholderImageURL =
  "https://cdn.dribbble.com/users/887568/screenshots/3172047/media/725fca9f20d010f19b3cd5411c50a652.gif";

const MyCart = () => {
  const user = storageService.get("user");
  const [selectedOption, setSelectedOption] = useState("cost");
  // const [quantity, setQuantity] = useState([])
  const [userCartData, setUserCartData] = useState({ items: [] });
  const [origins, setOrigins] = useState("");
  const [distanceToShop, setDistanceToShop] = useState(null);
  const [address, setAddress] = useState("");
  const [onCheck, setOnCheck] = useState(false);
  const GST_RATE = 0.18;
  const [products, setProducts] = useState([]);
  const currentDate = new Date();
  const [couponCode, setCouponCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [loading, setLoading] = useState(false)
  const [addQuantity, setAddQuantity] = useState('')
  const deliveryDate = new Date(currentDate.getTime() + 48 * 60 * 60 * 1000);
  const [referredBonusUsed, setReferredBonusUsed] = useState(false);
  const navigate = useNavigate();

  const day = deliveryDate.getDate();
  const month = deliveryDate.toLocaleString("default", { month: "short" });
  const formattedDeliveryDate = `Delivery by ${day} ${month}`;

  const destinations = "28.639472251102678, 77.35496546714297";

  const getDistance = async () => {
    const distance = await userService.getLocation(origins, destinations);
    // console.log(distance)
    setDistanceToShop(distance.data.distance);
    setAddress(distance.data.address);
  };

  const fetchProducts = async () => {
    try {
      const { data } = await getAllProductsAPI();
      const storageProducts = data.filter(
        (product) =>
          product.category === userCartData?.items[0]?.product?.category
      );
      const productWithIds = userCartData.items.map((item) => item.product._id);
      const filteredProducts = storageProducts.filter((product) => {
        return !productWithIds.includes(product._id)
      })
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [userCartData]);

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
  // useEffect(() => {
  //   getMyCart();
  // }, [userCartData]);

  // make some changes to the code to fix the bug 
  useEffect(() => {
    getMyCart();
  }, [userCartData._id]);



  // Calculate the total quantity of items in the cart
  const calculateTotalQuantity = () => {
    return userCartData?.items?.reduce((acc, curr) => {
      return acc + curr.rentOptions.quantity;
    }, 0);
  };

  const calculateShippingCost = () => {
    if (selectedOption === "free") return 0
    else {
      if (!userCartData?.items?.length) {
        console.error("Cart data is missing or empty.");
        return 0;
      }
      const sizeToSpace = { small: 15, medium: 20, large: 50 };
      const totalSpace = userCartData.items.reduce((total, cartItem) => {
        const productSize = cartItem?.product?.size;
        const space = sizeToSpace[productSize] || 0;
        const quantity = cartItem?.rentOptions?.quantity - 1;

        return total + space + (quantity * space);
      }, 0);


      const vehicleCapacity = 100;
      const vehiclesNeeded = Math.ceil(totalSpace / vehicleCapacity);

      const fixedCost = 400;
      const perKmCost = 70;
      let distanceCost = 0;

      if (distanceToShop <= 5) {
        distanceCost = fixedCost;
      } else {
        distanceCost = fixedCost + (distanceToShop - 5) * perKmCost;
      }
      const totalShippingCost = vehiclesNeeded * distanceCost;
      // console.log(totalShippingCost);

      return totalShippingCost;
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://truwix-rm-rental-backend-dev.vercel.app/api/coupon/validate`,
        {
          code: couponCode,
        }
      );
      if (response.data.valid) {
        setDiscountPercentage(response.data.discountPercentage);
        setErrorMessage("");
      } else {
        setErrorMessage("Invalid coupon code.");
      }
    } catch (error) {
      console.error("Error validating coupon:", error);
      setErrorMessage("Failed to validate coupon.");
    }
  };

  const calculateSecurityDeposit = () => {
    return (
      userCartData?.items?.reduce((acc, curr) => {
        const rentPrice = getRentMonthsPrice(
          curr.product?.rentalOptions,
          curr.rentOptions?.rentMonthsCount,
        );
        return acc + (rentPrice || 0) * 2 * curr.rentOptions.quantity; // 2x rent price for security deposit
      }, 0) || 0
    );
  };

  const getRentMonthsPrice = (rentalOptions, selectedMonth) => {
    if (!rentalOptions || !selectedMonth) return "No rent options";

    // Check if the selectedMonth exists in rentalOptions
    const rentPriceKey = `rent${selectedMonth}Months`; // Create the key like rent3Months, rent6Months, etc.
    const rentPrice = rentalOptions[selectedMonth];


    // If the rentPrice is found, return it as a float, else return "No rent options"
    return rentPrice ? parseFloat(rentPrice) : "No rent options";
  };

  const myproductAdd = async (productData, alertShow) => {
    try {
      setAddQuantity(productData._id)
      setLoading(true)
      let formData = productData.rentalOptions
      const selectedMonth = Object.keys(productData.rentalOptions)[0]
      if (!user) {
        toast.error("You are not logged in!");
        return;
      }

      // Validate that formData is an object and not an empty one
      if (!formData || typeof formData !== "object" || Object.keys(formData).length === 0) {
        toast.error("Invalid rental options. Please provide valid data.");
        console.error("formData is invalid:", formData);
        return;
      }

      // Extract rent months data from formData
      const rentMonthsData = selectedMonth;

      if (!rentMonthsData || rentMonthsData.length === 0) {
        toast.error("Invalid rental options. Please check your selection.");
        return;
      }

      // Send data to the API
      const data = await addToCartAPI({
        items: {
          product: productData,
          quantity: 1,
          rentMonthsCount: rentMonthsData,
          rentMonths: `rent${rentMonthsData}months`,
        },
      });
      if (data.success) {
        setLoading(false)
        setAddQuantity('')
        getMyCart()
        navigate("/mycart");
        if (alertShow) {
          alert("Product added to cart for rent successfully!");
        }
        toast.success("Product added to cart for rent successfully!");
      } else if (data?.error) {
        toast.error(data.error.message || "Product already in cart");
      } else {
        toast.error("Something went wrong while adding the product to the cart");
      }
    } catch (error) {
      setLoading(false)
      setAddQuantity('')
      console.error("Error adding product to cart:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  const calculateSubtotal = () => {
    return (
      userCartData?.items?.reduce((acc, curr) => {
        const rentPrice = getRentMonthsPrice(
          curr.product?.rentalOptions,
          curr.rentOptions?.rentMonthsCount
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
    const shippingFee = selectedOption === "cost" ? calculateShippingCost() : 0;
    const total = (subtotal || 0) + (gst || 0) + (deposit || 0) + (shippingFee || 0)
    return (
      total - (total * discountPercentage / 100)
    );
  };

  function handleIncreaseRentQuantity(productId) {
    myproductAdd(productId, false)
    const updatedCartItems = userCartData.items.map((item) => {
      if (item.product._id === productId._id) {
        return {
          ...item,
          rentOptions: {
            ...item.rentOptions,
            quantity: item.rentOptions.quantity + 1,
          },
        };
      }
      return item;
    });
    setUserCartData({ ...userCartData, items: updatedCartItems });
  }

  function handleDecreaseRentQuantity(productId) {
    subtractQuantity(productId)
    const updatedCartItems = userCartData.items.map((item) => {
      if (item.product._id === productId._id) {
        return {
          ...item,
          rentOptions: {
            ...item.rentOptions,
            quantity: item.rentOptions.quantity - 1,
          },
        };
      }
      return item;
    });
    setUserCartData({ ...userCartData, items: updatedCartItems });
  }

  async function subtractQuantity(product) {
    try {
      setLoading(true)
      const updatedCartItems = userCartData.items.map((item) => {
        if (item.product._id === product._id) {
          return {
            ...item,
            rentOptions: {
              ...item.rentOptions,
              quantity: item.rentOptions.quantity - 1,
            },
          };
        }
        return item;
      });
      setUserCartData({ ...userCartData, items: updatedCartItems });

      const data = await updateNewCartAPI({
        userId: userCartData.user,
        userCartNewData: updatedCartItems
      });

      if (data?.success) {
        setLoading(false)
        getMyCart()
      }

    } catch (error) {
      setLoading(false)
      console.error("Error subtracting quantity:", error);
    }
  }

  async function handlePay() {
    try {
      const data = await updateNewCartAPI({
        userId: userCartData.user,
        userCartNewData: userCartData.items
      });

      if (data?.success) {
        navigate("/address/finalPayment", {
          state: {
            cartTotal: calculateTotalPrice(), // Sending total price
            shippingCost: calculateShippingCost(), // Sending shipping fee
            cartItems: userCartData.items, // Sending cart items
            apiFetchedAddress: address,
            referredBonusUsed: referredBonusUsed ? true : false,
            furnitureRent: calculateSubtotal().toFixed(2),
            securityDeposit: calculateSecurityDeposit().toFixed(2)
          },
        });
      }

    } catch (error) {
      console.error("Error updating cart:", error);
    }
  }

  function referredBonus() {
    setReferredBonusUsed(true)
    setDiscountPercentage(10)
    alert("10% discount applied")
  }

  return (
    <div className="flex flex-col w-full px-4 md:px-10">
      <div className="cart-content flex flex-col md:flex-row mt-3">
        <div className="cart-items w-full 2xl:w-3/4">
          <div className="shop-heading">
            <h2 className="cart-heading">Shopping Cart</h2>
          </div>
          <div className="w-full h-auto flex flex-col md:flex-row text-center md:text-start gap-1 p-2 bg-gray-100 justify-center">

            <span className="font-bold text-center md:text-start md:hidden">Note :</span>
            <span className="text-red-500 text-center md:text-start">**</span>
            <p className="text-red-500">
              KYC verification is mandatory to initiate the delivery process.
              Please complete the KYC process before the delivery timeline
              begins.
            </p>
            <span className="text-red-500 text-center md:text-start">**</span>
          </div>
          {userCartData.items.length === 0 ? (
            <div className="empty-cart">
              <img src={placeholderImageURL} alt="Empty Cart" />
              <p>Your Cart is empty.</p>
            </div>
          ) : (
            userCartData.items.map((item, index) => (
              <div key={item?.product?._id} className="cart-border">
                <div className="cart-item">
                  <div className="image-to-left">
                    <img
                      src={item?.product?.img[0] || placeholderImageURL}
                      alt="Product"
                    />
                  </div>
                  <div className="item-details">
                    <h3 className="">{item?.product?.title}</h3>
                    <p className="sub-title">{item?.product?.sub_title}</p>
                    <p className="price">
                      {`₹ ${getRentMonthsPrice(

                        item?.product?.rentalOptions,
                        item?.rentOptions.rentMonthsCount,
                      ) * item?.rentOptions?.quantity
                        } / ${item?.rentOptions.rentMonthsCount} months on rent`}
                    </p>
                    <p>
                      Quantity:{" "}
                      <div className="productdetails-right-3">
                        <div className="Quantity-Selector">
                          <div
                            className={item?.rentOptions?.quantity === 1 ? "cursor-not-allowed bg-gray-200 rounded-full w-6 flex justify-center items-center" : "decrease-btn"}
                            onClick={() => {
                              if (item?.rentOptions?.quantity > 1) {
                                handleDecreaseRentQuantity(item?.product)
                              }
                            }}
                          >
                            <i className="ri-subtract-line"></i>
                          </div>
                          <div className="current-quantity">
                            {
                              loading && addQuantity === item?.product?._id
                                ? <RotatingLines
                                  visible={true}
                                  height="40"
                                  width="40"
                                  strokeColor="#ffd74d"
                                  strokeWidth="5"
                                  animationDuration="0.75"
                                  ariaLabel="rotating-lines-loading"
                                  wrapperStyle={{}}
                                  wrapperClass=""
                                />
                                : <div className="px16-medium">{item?.rentOptions?.quantity}</div>
                            }
                          </div>
                          <div
                            className="increase-btn"
                            onClick={() => handleIncreaseRentQuantity(item?.product)}
                          >
                            <i className="ri-add-line"></i>
                          </div>
                        </div>
                      </div>
                      {/* <span className="border rounded-full px-2 m-2 text-black">
                        {item?.rentOptions?.quantity}
                      </span> */}
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

        <div className="cart-overview 2xl:w-1/4">
          {/* <div className="cart-header"></div> */}
          <div className=" w-full mx-auto">
            <div
              className=" mx-auto w-full h-auto flex justify-center gap-2 mb-3"
            >
              <input
                type="checkbox"
                id="termsCheck"
                checked={onCheck}
                onClick={() => setOnCheck(!onCheck)}
                className=""
              />
              {/* Add Pdf file if user click in text */}
              <label htmlFor="termsCheck">
                <span>
                  I have accepted <Link to={"https://truwix1-my.sharepoint.com/:b:/g/personal/ujjwalk_truwix_com/ET2ucxAijj9IqtsyCStV39kBDqQCP1xDK3wUNyTpZe7sHg?e=4GxTVK"} target="_blank" rel="noopener noreferrer" class="text-blue-500 border-b border-blue-500">Terms & Conditions</Link>
                </span>
              </label>
            </div>
            <form className="w-full flex gap-3 mb-4" onSubmit={handleSubmit}>
              <input
                className="w-[80%] px-3 py-1 rounded-md border"
                type="text"
                placeholder="Discount Voucher"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                required
              />

              <input
                className="px-3 py-1 bg-[#dadada] rounded-md cursor-pointer"
                type="submit"
                value="Apply"
              />
            </form>
            {!userCartData?.user?.referredBonusUsed && userCartData?.user?.referredBy && (
              <div className="w-full h-auto flex justify-center items-center mb-3">
                <button
                  onClick={() => referredBonus()}
                  className="border py-2 px-6 rounded-full bg-[#fec500] text-white font-semibold"
                >
                  Use Your Referral Bonus
                </button>
              </div>
            )}

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {discountPercentage > 0 && (
              <p className="text-green-500">
                You have received a discount of {discountPercentage}%!
              </p>
            )}
            <button
              className={`flex justify-center w-full items-center proceed-btn py-0 ${userCartData.items.length === 0 || !onCheck
                ? "flex justify-center items-center w-full  cursor-not-allowed opacity-50"
                : ""
                }`}
              onClick={() => {
                if (userCartData.items.length !== 0 && onCheck) {
                  handlePay()
                  navigate("/address/finalPayment", {
                    state: {
                      cartTotal: calculateTotalPrice(), // Sending total price
                      shippingCost: calculateShippingCost(), // Sending shipping fee
                      cartItems: userCartData.items, // Sending cart items
                      apiFetchedAddress: address,
                      referredBonusUsed: referredBonusUsed ? true : false,
                      furnitureRent: calculateSubtotal().toFixed(2),
                      securityDeposit: calculateSecurityDeposit().toFixed(2)
                    },
                  });
                }
              }}
              disabled={userCartData.items.length === 0}
            >
              Pay ₹ {calculateTotalPrice()?.toFixed(2) || ""} Now{" "}
              <span className="arrow-icon mt-2 pt-1">→</span>
            </button>

          </div>

          <div className="summary w-full">
            <h3>Cost Summary</h3>
            {userCartData.items.map((item) => (
              <div key={item?.product?._id} className="rent-cost-breakup">
                <h4>
                  {item?.product?.title} X {item?.rentOptions.quantity}
                </h4>
              </div>
            ))}
            <hr />
            <div className="mt-2">
              <span className="w-full text-base font-bold">
                Shipping Options:
              </span>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="free"
                    checked={selectedOption === "free"}
                    onChange={handleOptionChange}
                  />
                  <span>Free Delivery (10-15 Days)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="cost"
                    checked={selectedOption === "cost"}
                    onChange={handleOptionChange}
                  />
                  <span>Shipping: ₹ {calculateShippingCost()?.toFixed(2)}</span>
                </label>
              </div>

              <div className="mt-4">
                <p>
                  <strong>Selected Shipping:</strong>{" "}
                  {selectedOption === "free"
                    ? "Free Delivery"
                    : `₹ ${calculateShippingCost()?.toFixed(2)}`}
                </p>
              </div>
            </div>
            <p>
              <strong>GST (18%):</strong> ₹ {calculateGST()?.toFixed(2)}
            </p>
            {/* <p>
              <strong>Shipping:</strong> ₹ {calculateShippingFee().toFixed(2)}
            </p> */}
            <p>
              <strong>Security Deposit:</strong> ₹{" "}
              {calculateSecurityDeposit().toFixed(2)}
            </p>
            <p>
              <strong>Total Furniture Rent:</strong> ₹{" "}
              {calculateSubtotal().toFixed(2)}
            </p>
            <hr />
            <p className="mt-2">
              <strong>Total:</strong> ₹ {calculateTotalPrice()?.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col my-20">
        <h1 className="text-4xl font-bold text-center mb-10">
          Related Products
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <div
              key={product?._id} // Ensure your product object has a unique `id` field
              className="border px-4 flex flex-col justify-between rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition duration-500 ease-in-out"
            >
              <Link
                to={`/product/${product?._id}`} className="w-full h-auto">
                <div>
                  <img src={product.img[0]} alt="product image" className="h-80 object-cover" />
                </div>
                <h2 className="font-bold text-lg h-14 mt-2">{product?.title?.substring(0, 40)}</h2>
                <p className="text-sm mt-2">{`${product?.details?.description.substring(
                  0,
                  100
                )}"`}</p>
              </Link>
              <button
                className="bg-yellow-400 text-black px-4 py-2 my-4 rounded-lg "
                onClick={(e) => {
                  myproductAdd(product, true)
                }}
              >
                Add to cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCart;

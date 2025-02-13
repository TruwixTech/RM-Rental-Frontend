/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "../assets/csss/Productdetails.css";
import { useParams } from "react-router-dom";
import { addToCartAPI, getCartAPI } from "../service/cart.service";
import { getProductByIdAPI } from "../service/products.service";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import storageService from "../service/storage.service";

const ProductDetails = () => {
  const user = storageService.get("user");
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(1);
  const [isItemAlreadyInCart, setIsItemAlreadyInCart] = useState(false);
  const [rentQuantity, setRentQuantity] = useState(1); // Separate state for rent quantity
  const { id } = useParams();

  const navigate = useNavigate();


  const getProductData = async () => {
    try {
      const response = await getProductByIdAPI(id);
      if (response && response.data) {
        setProductData(response.data);

        if (response.data.img && response.data.img.length > 0) {
          setSelectedImage(response.data.img[0]);
        }
        if (response.data.details?.month?.length > 0) {
          const minMonth = Math.min(...response.data.details.month);
          setSelectedMonth(minMonth);
        }
      } else {
        toast.error("Failed to load product details. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching product details.");
    }
  };

  useEffect(() => {
    getProductData();
    getMyCart()
  }, [id]);
  // const getRentMonths = (formData) => {
  //   const { month, rentalOptions } = formData;
  //   // if data format is not valid then enter the null
  //   if (!Array.isArray(month) || typeof rentalOptions !== "object") {
  //     return null; 
  //   }
  //   // Map the month array with rental options dynamically
  //   return month.map((item) => ({
  //     month: item,
  //     rent: rentalOptions[item] || null, 
  //   }));
  // };
  const getRentMonths = (formData) => {
    if (!formData || typeof formData !== "object") {
      console.error("formData is invalid:", formData);
      return null;
    }
    if (!Array.isArray(month)) {
      console.error("month is not an array:", month);
      return null;
    }

    if (!Array.isArray(rentalOptions)) {
      console.error("rentalOptions is not an array of objects:", rentalOptions);
      return null;
    }

    // Map months to their corresponding rents from rentalOptions
    return month.map((item) => {
      const rentOption = rentalOptions.find(
        (option) => option.month === String(item) || option.month === item // Match month as string or number
      );
      return {
        month: item,
        rent: rentOption ? rentOption.rent : null, // If no match, set rent as null
      };
    });
  };

  const getMyCart = async () => {
    const { data } = await getCartAPI(user?._id);
    if (data && data.items) {
      setIsItemAlreadyInCart(data.items.some((item) => item.product._id === id));
    }
  };


  const myproductAdd = async (productData, formData) => {
    try {
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
          quantity: rentQuantity,
          rentMonthsCount: rentMonthsData,
          rentMonths: `rent${rentMonthsData}months`,
        },
      });
      if (data.success) {
        getMyCart()
        alert("Product added to cart for rent successfully!");
        // toast.success("Product added to cart for rent successfully!");
      } else if (data?.error) {
        toast.error(data.error.message || "Product already in cart");
      } else {
        toast.error("Something went wrong while adding the product to the cart");
      }
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };
  const handleIncreaseRentQuantity = () => {
    setRentQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecreaseRentQuantity = () => {
    setRentQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  };

  const handleImageSelect = (imgSrc) => {
    setSelectedImage(imgSrc);
  };
  const handleMonthClick = (month) => {
    setSelectedMonth(month);
  };
  const getRentPrice = (rentalOptions, selectedMonth) => {
    if (!rentalOptions || !selectedMonth) return "No rent options";
    const rentPrice = rentalOptions[selectedMonth];

    return rentPrice ? parseFloat(rentPrice) : "No rent options";
  };

  return (
    <>
      <div className="productdetails">
        <div className="productdetails-left">
          <div className="productdetails-left-up">
            <div className="Product-Images-Container">
              <div className="fourimg overflow-y-auto" style={{
                scrollbarWidth: "none",
              }}>
                {productData?.img &&
                  productData.img.map((imgSrc, index) => (
                    <div
                      key={index}
                      onClick={() => handleImageSelect(imgSrc)}
                      className={` ${selectedImage === imgSrc ? "selected-image" : ""
                        }`}
                    >
                      <img
                        src={imgSrc}
                        alt={`Thumbnail ${index + 1}`}
                        className="image "
                      />
                    </div>
                  ))}
              </div>

              <div className="singleimg">
                {selectedImage && (
                  <img src={selectedImage} alt="Main Product" />
                )}
              </div>
            </div>
          </div>
          <br />
          <hr className="Separator" />

          <div className="productdetails-left-down">
            <br />
            <div className="Main-Title">{productData?.title}</div>
            <div className="Description-Container">
              {productData?.sub_title}
            </div>
            <div className="Description-Container" style={{ whiteSpace: "pre-wrap" }}>
              {productData?.details?.description}
            </div>
          </div>
        </div>

        <div className="productdetails-right">

          <div className="productdetails-right-1">
            <div className="productdetails-right-1-1">
              <i className="ri-star-fill"></i>
              <span>4.5</span>
              <span>.</span>
              <span>149 reviews</span>
            </div>
            {productData?.rentalOptions && (
              <>
                <div className="month-selector">
                  {Object.keys(productData?.rentalOptions)
                    .filter((monthKey) => !monthKey.includes('0'))
                    .map((monthKey) => {
                      const month = monthKey.replace('rent', '').replace('Months', '');
                      return (
                        <button
                          key={month}
                          onClick={() => handleMonthSelect(month)}
                          className={`month-button ${selectedMonth === month ? 'selected' : ''}`}
                        >

                        </button>
                      );
                    })}
                </div>
                <div className="price-lg">
                  <span>Rent at</span>
                  <h3>
                    {selectedMonth ? (
                      <div>
                        <span
                          style={{
                            textDecoration: "line-through",
                            marginRight: "8px",
                          }}
                        >
                          {"₹ " +
                            ((Number(getRentPrice(productData?.rentalOptions, selectedMonth)) || 0) * 1.1).toFixed(2)}
                        </span>
                        <span>
                          {"₹ " +
                            (Number(getRentPrice(productData?.rentalOptions, selectedMonth)) || 0).toFixed(2) +
                            " /month"}
                        </span>
                      </div>
                    ) : (
                      "Select month"
                    )}
                  </h3>
                </div>

              </>
            )}
          </div>
          <div className="w-full h-auto flex flex-wrap justify-between gap-4">
            <div className="w-auto h-auto flex flex-col">
              <h1 className="font-semibold">Category :</h1>
              <p className="text-gray-600 font-semibold text-lg">{productData?.category ? productData?.category.charAt(0).toUpperCase() + productData?.category.slice(1) : ''}</p>
            </div>
            <div className="w-auto h-auto flex flex-col">
              <h1 className="font-semibold">Stock :</h1>
              <p className="text-gray-600 font-semibold text-lg mr-6">{productData?.quantity ? productData?.quantity : 'Out of Stock'}</p>
            </div>
            {
              productData?.height && (
                <div className="w-auto h-auto flex flex-col">
                  <h1 className="font-semibold">Height :</h1>
                  <p className="text-gray-600 font-semibold text-lg mr-6">{productData?.height}</p>
                </div>
              )
            }
            {
              productData?.width && (
                <div className="w-auto h-auto flex flex-col">
                  <h1 className="font-semibold">Width :</h1>
                  <p className="text-gray-600 font-semibold text-lg mr-6">{productData?.width}</p>
                </div>
              )
            }
            {
              productData?.weight && (
                <div className="w-auto h-auto flex flex-col">
                  <h1 className="font-semibold">Weight :</h1>
                  <p className="text-gray-600 font-semibold text-lg mr-6">{productData?.weight}</p>
                </div>
              )
            }
          </div>
          {
            productData?.hsncode && (
              <div className="w-full h-auto flex gap-2">
                <span className="font-semibold">HSN Code :</span>
                <span>{productData?.hsncode}</span>
              </div>
            )
          }
          <div className="productdetails-right-2">
            <h5>Months</h5>
            <div className="flex flex-wrap gap-4">
              {Object.entries(productData?.rentalOptions || {}).map(([month, price], index) => (
                <div
                  key={index}
                  className={`px-3 py-2 cursor-pointer rounded-xl ${selectedMonth == month ? "bg-gray-400 text-white border-none" : "bg-light border border-gray-900 text-black"
                    }`}
                  onClick={() => handleMonthClick(month)}
                >
                  <span className="font-semibold">{month} Mon</span>
                </div>
              ))}
            </div>
          </div>
          <div className="productdetails-right-3">
            <div className="Quantity-Selector">
              <div
                className="decrease-btn"
                onClick={handleDecreaseRentQuantity}
              >
                <i className="ri-subtract-line"></i>
              </div>
              <div className="current-quantity">
                <div className="px16-medium">{rentQuantity}</div>
              </div>
              <div
                className="increase-btn"
                onClick={handleIncreaseRentQuantity}
              >
                <i className="ri-add-line"></i>
              </div>
            </div>
            {
              user ? (
                <button
                  className="cart-button py-2 px-4"
                  onClick={() => myproductAdd(productData, productData?.rentalOptions)}
                >
                  <i className="ri-shopping-bag-line"></i>
                  <div className="Add-to-Cart-Button">
                    Add to Cart
                  </div>
                </button>
              ) :
                (
                  <button
                    className="cart-button py-2 px-4"
                    onClick={() => {
                      alert("Please login first for Add to Cart Functionality");
                      navigate("/login");
                    }}
                  >
                    <i className="ri-shopping-bag-line"></i>
                    <div className="Add-to-Cart-Button">
                      Add to Cart
                    </div>
                  </button>
                )
            }
            {/* <button
              className="cart-button py-2 px-4"
              onClick={() => isItemAlreadyInCart ? toast.error("Product already in cart") : myproductAdd(productData, productData?.rentalOptions)}

            >
              <i className="ri-shopping-bag-line"></i>
              <div className="Add-to-Cart-Button">
                {
                  isItemAlreadyInCart ? "Added to cart" : "Add to Cart"
                }
              </div>
            </button> */}

          </div>
          <div className="productdetails-right-4">
            <hr className="seperator" />
            <div className="total">
              <div className="Total-Label">
                <h5>Total Rent Price</h5>
              </div>
              <div className="Total-Amount">
                <h5>
                  ₹
                  {selectedMonth && !isNaN(getRentPrice(productData?.rentalOptions, selectedMonth))
                    ? (getRentPrice(productData?.rentalOptions, selectedMonth) * rentQuantity).toFixed(2)
                    : "0.00"}
                </h5>
              </div>
            </div>
          </div>

          {
            productData?.hsnbarcode && (
              <>
                <h1 className="font-semibold text-lg">HSN Bar Code :</h1>
                <img src={productData?.hsnbarcode} alt="hsnbarcode" className="w-60 h-60 object-cover mx-auto" />
              </>
            )
          }


        </div>
      </div>
    </>
  );
};

export default ProductDetails;

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "../assets/csss/Productdetails.css";
import { useParams } from "react-router-dom";
import { addToCartAPI } from "../service/cart.service";
import { getProductByIdAPI } from "../service/products.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import storageService from "../service/storage.service";

const ProductDetails = () => {
  const user = storageService.get("user");
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(3);
  // const [buyQuantity, setBuyQuantity] = useState(1); // Separate state for buy quantity
  const [rentQuantity, setRentQuantity] = useState(1); // Separate state for rent quantity
  const { id } = useParams();

  const navigate = useNavigate();

  const getProductData = async () => {
    try {
      const response = await getProductByIdAPI(id);

      // Check if response exists and contains data
      if (response && response.data) {
        setProductData(response.data);

        if (response.data.img && response.data.img.length > 0) {
          setSelectedImage(response.data.img[0]);
        }
      } else {
        toast.error("Failed to load product details. Please try again.");
      }
    } catch (error) {
      toast.error("Something went wrong while fetching product details.");
    }
  };

  useEffect(() => {
    const getProductData = async () => {
      try {
        const response = await getProductByIdAPI(id);

        // Check if response exists and contains data
        if (response && response.data) {
          setProductData(response.data);

          if (response.data.img && response.data.img.length > 0) {
            setSelectedImage(response.data.img[0]);
          }

          // Automatically select the lowest available month
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

    getProductData();
  }, [id]);

  const getRentMonths = (selectedMonth) => {
    switch (selectedMonth) {
      case 3:
        return "rent3Months";
      case 6:
        return "rent6Months";
      case 9:
        return "rent9Months";
      case 12:
        return "rent12Months";
      default:
        return null;
    }
  };

  const myproductAdd = async (type) => {
    if (!user) {
      toast.error("You are not logged in!");
      return;
    }
    let rent_quantity = 1;

    switch (type) {
      case "rent":
        rent_quantity = rentQuantity;
        if (productData) {
          const data = await addToCartAPI({
            items: {
              product: productData?._id,
              quantity: rent_quantity,
              rentMonthsCount: selectedMonth, // 3, 6, 9, or 12
              rentMonths: getRentMonths(selectedMonth), // Human-readable months
            },
          });

          if (data?.success) {
            // Show success message when product is added to cart for rent
            toast.success(
              `Product added to cart for ${selectedMonth} months rent`
            );
            navigate("/mycart");
          } else {
            toast.error("Product already in cart");
          }
        }
        break;

      default:
        break;
    }
  };

  // const handleIncreaseBuyQuantity = () => {
  //   setBuyQuantity((prevQuantity) => prevQuantity + 1);
  // };

  // const handleDecreaseBuyQuantity = () => {
  //   setBuyQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1));
  // };

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

  const getRentPrice = () => {
    if (!selectedMonth || !productData) return null;

    switch (selectedMonth) {
      case 3:
        return productData.rentalOptions.rent3Months || "No rent options";
      case 6:
        return productData.rentalOptions.rent6Months || "No rent options";
      case 9:
        return productData.rentalOptions.rent9Months || "No rent options";
      case 12:
        return productData.rentalOptions.rent12Months || "No rent options";
      default:
        return "No rent options";
    }
  };

  return (
    <>
      <div className="productdetails">
        <div className="productdetails-left">
          <div className="productdetails-left-up">
            <div className="Product-Images-Container">
              <div className="fourimg">
                {productData?.img &&
                  productData.img.map((imgSrc, index) => (
                    <div
                      key={index}
                      onClick={() => handleImageSelect(imgSrc)}
                      className={` ${
                        selectedImage === imgSrc ? "selected-image" : ""
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
            <div className="Description-Container">
              {productData?.details?.description}
            </div>
            {/* <div className="Fabric">
              <div className="Section-Title">Fabric + Care</div>
              <div className="Fabric-Details">
                <div className="Info-Row">
                  Material: {productData?.details?.fabricCare?.material}
                </div>
                <div className="Info-Row">
                  Color: {productData?.details?.fabricCare?.color?.[0]}
                </div>
              </div>
            </div> */}

            {/* <div className="Fabric">
              <div className="Section-Title">Wood Type</div>
              <div className="Fabric-Details">
                <div className="Info-Row">
                  Material: {productData?.details?.woodType?.material}
                </div>
                <div className="Info-Row">
                  Color: {productData?.details?.woodType?.color?.[0]}
                </div>
              </div>
            </div> */}
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
            {/* <div className="price-lg">
              <span>Buy at</span>
              <h3>₹{productData?.buyPrice}</h3>
            </div> */}
            {productData?.details?.month && (
              <div className="price-lg">
                <span>Rent at</span>
                <h3>
                  {selectedMonth ? (
                    <div>
                      {" "}
                      <span
                        style={{
                          textDecoration: "line-through",
                          marginRight: "8px",
                        }}
                      >
                        {"₹ " +
                          ((Number(getRentPrice()) || 0) * 1.1).toFixed(2)}
                      </span>
                      <span>
                        {"₹ " +
                          (Number(getRentPrice()) || 0).toFixed(2) +
                          "/ month"}
                      </span>
                    </div>
                  ) : (
                    "Select month"
                  )}
                </h3>
              </div>
            )}
          </div>

          <div className="productdetails-right-2">
            <h5>Months</h5>
            <div className="flex gap-4">
              {productData?.details?.month?.map((month, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 cursor-pointer rounded-xl ${
                    selectedMonth === month
                      ? "bg-gray-400 text-white border-none"
                      : "bg-light border border-gray-900 text-black"
                  }`}
                  onClick={() => handleMonthClick(month)}
                >
                  <span className="font-semibold">{month} Mon</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buy Quantity and Add to Cart Button */}
          {/* <div className="productdetails-right-3">
            <div className="Quantity-Selector">
              <div className="decrease-btn" onClick={handleDecreaseBuyQuantity}>
                <i className="ri-subtract-line"></i>
              </div>
              <div className="current-quantity">
                <div className="px16-medium">{buyQuantity}</div>
              </div>
              <div className="increase-btn" onClick={handleIncreaseBuyQuantity}>
                <i className="ri-add-line"></i>
              </div>
            </div>
            <button className="cart-button" onClick={() => myproductAdd("buy")}>
              <i className="ri-shopping-bag-line"></i>
              <div className="Add-to-Cart-Button"> Buy</div>
            </button>
          </div> */}

          {/* Rent Quantity and Add to Cart Button */}
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
            <button
              className="cart-button py-2 px-4"
              onClick={() => myproductAdd("rent")}
            >
              <i className="ri-shopping-bag-line"></i>
              <div className="Add-to-Cart-Button">Add to cart</div>
            </button>
          </div>

          {/* <div className="productdetails-right-4">
            <hr className="seperator" />

            <div className="total">
              <div className="Total-Label">
                <h5>Total Buy Price</h5>
              </div>
              <div className="Total-Amount">
                <h5>₹{productData?.buyPrice * buyQuantity}</h5>
              </div>
            </div>
          </div> */}

          <div className="productdetails-right-4">
            <hr className="seperator" />
            <div className="total">
              <div className="Total-Label">
                <h5>Total Rent Price</h5>
              </div>
              <div className="Total-Amount">
                <h5>₹{getRentPrice() * rentQuantity}</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;

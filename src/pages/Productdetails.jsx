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
  }, [id]);
  const getRentMonths = (formData) => {
    const { month, rentalOptions } = formData;
    // if data format is not valid then enter the null
    if (!Array.isArray(month) || typeof rentalOptions !== "object") {
      return null; 
    }
    // Map the month array with rental options dynamically
    return month.map((item) => ({
      month: item,
      rent: rentalOptions[item] || null, 
    }));
  };
  

  const myproductAdd = async (productId) => {
    if (!user) {
      toast.error("You are not logged in!");
      return;
    }

    const data = await addToCartAPI({
      items: {
        product: productId,
        quantity: 1,
        rentMonthsCount: 3, // 3, 6, 9, or 12
        rentMonths: "rent3Months", // Human-readable months
      },
    });

    if (data?.success) {
      // Show success message when product is added to cart for rent
      toast.success(`Product added to cart for 3 months rent`);
      navigate("/mycart");
    } else {
      toast.error("Product already in cart");
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
              <div className="fourimg">
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
            <div className="Description-Container">
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
  {productData?.details?.month && (
    <>
      <div className="month-selector">
      {Object.keys(productData?.details.month)
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


          <div className="productdetails-right-2">
            <h5>Months</h5>
            <div className="flex flex-wrap gap-4">
              {productData?.details?.month?.map((month, index) => (
                <div
                  key={index}
                  className={`px-3 py-2 cursor-pointer rounded-xl ${selectedMonth === month
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
              <div className="Add-to-Cart-Button">Add to Cart</div>
            </button>
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


        </div>
      </div>
    </>
  );
};

export default ProductDetails;

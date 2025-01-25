/* eslint-disable no-unused-vars */
import "../../assets/csss/Chairs.css";
import { useEffect, useState } from "react";
import { getAllProductsAPI } from "../../service/products.service";
import { Link } from "react-router-dom";
import { addToCartAPI } from "../../service/cart.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import storageService from "../..//service/storage.service";

const Chairs = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = storageService.get("user");
  const fetchProducts = async () => {
    try {
      const response = await getAllProductsAPI(1, 8, 10);
      const { data } = response;

      // Sort products by createdAt (latest first) and get top 4
      const sortedProducts = data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);
      setProducts(sortedProducts);
    } catch (err) {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const getLowestRentPrice = (rentalOptions) => {
    if (!rentalOptions)
      return "No rent options";

    const rentPrices = Object.values(rentalOptions)
      .filter((value) => !isNaN(value))
      .map((value) => parseFloat(value))
      .sort((a, b) => a - b); // Sort in ascending order
    return rentPrices.length > 0 ? rentPrices[0] : "No rent options";
  };

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600">{error}</div>;
  }

  return (
    <div className="chair-container">
      <div className="chairs-heading">
        <h1 className="font-satoshi">Our New Products</h1>
        <p className="font-satoshi">Check out what is new in the market!</p>
      </div>

      <div className="card-grid w-full mt-10">
        {products.map((product) => (
          <Link to={`/product/${product?._id}`} key={product?._id} className="bg-white rounded-lg">
            <div className="bg-gray-500">
              <div>
                <img
                  // className="rounded-lg w-full h-64 object-cover"
                  className="rounded-lg w-full h-72 object-cover"
                  src={product.img[0]}
                  alt="Product image Not Found"
                  onError={(e) => {
                    e.target.src =
                      "https://5.imimg.com/data5/SELLER/Default/2024/6/429181615/CM/AE/LG/41750052/li4411-home-collection-mechanical-hands-massage-chair-500x500.jpg";
                  }}
                />
              </div>
            </div>
            <div className="p-7">
              <div>
                <p className="text-base">Chair</p>
                <h3 className="mt-2 w-[200px] text-base font-bold tracking-tight font-satoshi text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
                  {product.title}
                </h3>
              </div>
              <div className="card-rating text-2xl">{"★".repeat(5)}</div>
              <div className="price-cont flex justify-between items-center">
                <p className="card-price text-lg font-semibold font-satoshi flex">
                  {product.rentalOptions && Object.keys(product.rentalOptions).length > 0 ? (
                    <h5>
                      <span
                        style={{
                          textDecoration: "line-through",
                          marginRight: "1px",
                        }}
                      >
                      </span>
                      {"₹" +
                        Number(getLowestRentPrice(product.rentalOptions)).toFixed(2) +
                        " /month"}
                    </h5>
                  ) : (
                    "No rent options"
                  )}
                </p>
                <button
                  className="card-add-button"
                  onClick={() => myproductAdd(product?._id)}
                >
                  +
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Chairs;

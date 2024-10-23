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
    if (!rentalOptions) return "No rent options";

    const { rent3Months, rent6Months, rent9Months, rent12Months } = rentalOptions;
    const rents = [rent3Months, rent6Months, rent9Months, rent12Months].filter(
      (rent) => rent !== null && rent !== undefined
    );

    return rents.length > 0 ? rents[0] : "No rent options";
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
        <h1>Our New Products</h1>
        <p>Check out what is new in the market!</p>
      </div>

      <div className="card-grid">
        {products.map((product) => (
          <div
            key={product?._id}
            className="md:max-w-80 bg-white rounded-lg"
          >
            <div className="image-container p-2 rounded-t-lg">
              <Link to={`/product/${product?._id}`}>
                <img
                  className="rounded-lg w-full h-64 object-cover"
                  src={product.img[0]}
                  alt="Product image Not Found"
                  onError={(e) => {
                    e.target.src =
                      "https://5.imimg.com/data5/SELLER/Default/2024/6/429181615/CM/AE/LG/41750052/li4411-home-collection-mechanical-hands-massage-chair-500x500.jpg";
                  }}
                />
              </Link>
            </div>
            <div className="p-4">
              <Link to={`/product/${product?._id}`}>
                <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
                  {product.title}
                </h3>
              </Link>
              <div className="card-rating text-2xl">{"★".repeat(5)}</div>
              <div className="price-cont flex justify-between items-center">
                <p className="card-price text-lg font-semibol mb-0">
                  {product.rentalOptions &&
                  (product.rentalOptions.rent3Months ||
                    product.rentalOptions.rent6Months ||
                    product.rentalOptions.rent9Months ||
                    product.rentalOptions.rent12Months) ? (
                    <h5>
                      <span
                        style={{
                          textDecoration: "line-through",
                          marginRight: "8px",
                        }}
                      >
                        {/* Commented out the original price display */}
                      </span>
                      {"₹" +
                        Number(
                          getLowestRentPrice(product.rentalOptions)
                        ).toFixed(2) +
                        " onwards"}
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chairs;

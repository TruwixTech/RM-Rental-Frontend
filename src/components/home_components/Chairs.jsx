import "../../assets/csss/Chairs.css";
import { useEffect, useState } from "react";
import { getAllProductsAPI } from "../../service/products.service";
import {Link} from "react-router-dom"

const Chairs = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <Link to={`/product/${product?._id}`} className="card" key={product?._id}>
            <div className="card-img">
              <img src={product.img[0]} alt={product.title} />
            </div>
            <div className="cardddd">
              <div className="card-sqr"></div>
              <div className="card-details">
                <span className="card-category text-xl truncate">{product?.title}</span>
                <div className="price-cont">
                  <p className="card-price">
                    {product.rentalOptions &&
                    (product.rentalOptions.rent3Months ||
                      product.rentalOptions.rent6Months ||
                      product.rentalOptions.rent9Months ||
                      product.rentalOptions.rent12Months) ? (
                      <h5>
                        {"Rent ₹ " +
                          getLowestRentPrice(product.rentalOptions) +
                          " onwards"}
                      </h5>
                    ) : (
                      "No rent options"
                    )}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Chairs;

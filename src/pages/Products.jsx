import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../assets/csss/Products.css";
import { getAllProductsAPI } from "../service/products.service";
import { addToCartAPI } from "../service/cart.service";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import storageService from "../service/storage.service";

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = storageService.get("user");
  const selectedCategory = location.state?.selectedCategory || "";
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Define searchTerm state
  const [productFilter, setProductFilter] = useState({
    page: 1,
    limit: 8,
    size: 10,
  });
  const [sortOption, setSortOption] = useState("latest");
  const [selectedCategories, setSelectedCategories] = useState(
    selectedCategory ? new Set([selectedCategory]) : new Set()
  );

  const getProducts = async () => {
    const { data } = await getAllProductsAPI(
      productFilter.page,
      productFilter.limit,
      productFilter.size
    );
  

    const filtered = selectedCategories.size
      ? data.filter((product) => selectedCategories.has(product.category))
      : data;

    const sortedProducts = filtered.sort((a, b) => {
      if (sortOption === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

    setProducts(sortedProducts);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    const updatedCategories = new Set(selectedCategories);
    if (updatedCategories.has(category)) {
      updatedCategories.delete(category);
    } else {
      updatedCategories.add(category);
    }
    setSelectedCategories(updatedCategories);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  useEffect(() => {
    getProducts();
  }, [selectedCategories, sortOption]);

 
  
  const myproductAdd = async (productId) => {
    if (!user) {
      toast.error("You are not logged in!");
      return;
    }

    const data = await addToCartAPI({
      items: {
        // product: productId,
        // quantity: 1,
        // rentMonthsCount: rentMonthsData.length,
        // rentMonths: rentMonthsData,
        product: productData,
          quantity: 1,
          rentMonthsCount: rentMonthsData,
          rentMonths: `rent${rentMonthsData}months`,
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
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase().trim();
    const productName = product.title ? product.title.toLowerCase() : "";
    const matchFound = productName.includes(searchLower);
    return matchFound;
  });
  return (
    <div>
      <div className="productpage">
        <div className="productpage-left hidden md:block">
          <div className="productpage-left-sidebar">
            <div className="productpage-left-sidebar-filters bg-white rounded-md shadow-md p-4">
              <div className="filter-title text-lg font-semibold mb-4 border-b pb-2">
                Filter by Categories
              </div>
              <div className="checkboxes space-y-4">
                {[
                  { id: "category-appliance", value: "appliance" },
                  { id: "category-livingroom", value: "livingroom" },
                  { id: "category-storage", value: "storage" },
                  { id: "category-studryroom", value: "studyroom" },

                  { id: "category-bed", value: "bedroom" },
                  // { id: "category-table", value: "table" },
                  { id: "category-table", value: "package" },
                  { id: "category-table", value: "dinningroom" },
                ].map((category) => (
                  <div className="checkbox flex items-center" key={category.id}>
                    <div className="checkbox-grp flex items-center">
                      <input
                        type="checkbox"
                        id={category.id}
                        name="category"
                        value={category.value}
                        onChange={handleCategoryChange}
                        className="mr-2 w-5 h-5 accent-blue-500 transition duration-200 ease-in-out transform hover:scale-110"
                        checked={selectedCategories.has(category.value)} // Automatically check the box if selected
                      />
                      <label
                        htmlFor={category.id}
                        className="text-md font-medium text-gray-800"
                      >
                        {category.value.toLocaleUpperCase()}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="productpage-right sm:w-auto">
          <div className="flex flex-col md:flex-row gap-6  md:justify-between items-center mb-4">
            <div>
              Showing {productFilter.limit * (productFilter.page - 1) + 1} to{" "}
              {Math.min(
                productFilter.limit * productFilter.page,
                products.length
              )}{" "}
              of {products.length} products
            </div>
            <div className="w-[90%] md:w-[35%] relative mt-2">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="py-2 pl-10 pr-4 w-full rounded-full border border-gray-300 text-sm focus:outline-none "
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="custom-select">
              <select
                className="border border-gray-300 rounded-full p-2"
                value={sortOption}
                onChange={(e) => {
                  setSortOption(e.target.value);
                }}
              >
                <option value="latest">Sort by Latest</option>
                <option value="oldest">Sort by Oldest</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Link
                to={`/product/${product?._id}`}
                key={product._id}
                className="md:max-w-80 bg-white rounded-lg "
              >
                <div className="image-container p-2 rounded-t-lg">
                  {/* removed bg-gray-100 from this line*/}
                  <a href={"/product/" + product?._id}>
                    <img
                      className="rounded-lg w-full h-64 object-cover"
                      src={product.img[0]}
                      alt="Product image Not Found"
                      onError={(e) => {
                        e.target.src =
                          "https://5.imimg.com/data5/SELLER/Default/2024/6/429181615/CM/AE/LG/41750052/li4411-home-collection-mechanical-hands-massage-chair-500x500.jpg";
                      }}
                    />
                  </a>
                </div>
                <div className="p-4">
                  <a href="#">
                    <h3 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
                      {product.title}
                    </h3>
                  </a>
                  <div className="card-rating text-2xl">{"★".repeat(5)}</div>
                  <div className="price-cont flex justify-between items-center">
  <p className="card-price text-lg font-semibold text-gray-200 mb-0">
  
    {product.rentalOptions && Object.keys(product.rentalOptions).length > 0 ? (
      
      <h5>
        <span
          style={{
            textDecoration: "line-through",
            marginRight: "8px",
          }}
        >
          {/* You can uncomment this if you want to show the crossed-out price */}
          {/* {"₹ " + (Number(getLowestRentPrice(product.rentalOptions)) * 1.1).toFixed(2)} */}
        </span>
        {"₹" +
          Number(getLowestRentPrice(product.rentalOptions)).toFixed(2) +
          " /month"}
      </h5>
    ) : (
      "No rent Options"
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

          <div className="productpage-right-card-grid"></div>
          <div className="pagination">
            <button
              onClick={() =>
                setProductFilter({
                  ...productFilter,
                  page: productFilter.page - 1,
                })
              }
              disabled={productFilter.page === 1}
            >
              Prev
            </button>
            <button
              onClick={() =>
                setProductFilter({
                  ...productFilter,
                  page: productFilter.page + 1,
                })
              }
              disabled={
                productFilter.page * productFilter.limit >= products.length
              }
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;

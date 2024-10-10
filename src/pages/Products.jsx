import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../assets/csss/Products.css";
import { getAllProductsAPI } from "../service/products.service";

const Products = () => {
  const location = useLocation();
  const selectedCategory = location.state?.selectedCategory || "";
  const [products, setProducts] = useState([]);
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

  useEffect(() => {
    getProducts();
  }, [selectedCategories, sortOption]);

  const getLowestRentPrice = (rentalOptions) => {
    if (!rentalOptions) return "No rent options";

    const { rent3Months, rent6Months, rent9Months, rent12Months } =
      rentalOptions;
    const rents = [rent3Months, rent6Months, rent9Months, rent12Months].filter(
      (rent) => rent !== null && rent !== undefined
    );

    return rents.length > 0 ? rents[0] : "No rent options";
  };

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
                  { id: "category-sofa", value: "Living Room" },
                  // { id: "category-kitchen", value: "kitchen" },
                  { id: "category-storage", value: "storage" },
                  { id: "category-bed", value: "bedroom" },
                  // { id: "category-bath", value: "bath" },
                  { id: "category-chair", value: "study room" },
                  { id: "category-table", value: "table" },
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
          <div className="flex justify-between items-center mb-4">
            <p>
              Showing {productFilter.limit * (productFilter.page - 1) + 1} to{" "}
              {Math.min(
                productFilter.limit * productFilter.page,
                products.length
              )}{" "}
              of {products.length} products
            </p>

            <div className="custom-select">
              <select
                className="border border-gray-300 rounded p-1"
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
            {products.map((product) => (
              <div
                key={product._id}
                className="md:max-w-80 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
              >
                <div className="image-container bg-gray-100 p-2 rounded-t-lg">
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
                  <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                    {product.sub_title}
                  </p>
                  <div className="card-rating text-2xl">{"★".repeat(5)}</div>
                  <div className="price-cont flex justify-between items-center">
                    <p className="card-price text-lg font-semibold text-gray-900 mb-0">
                      {product.rentalOptions &&
                      (product.rentalOptions.rent3Months ||
                        product.rentalOptions.rent6Months ||
                        product.rentalOptions.rent9Months ||
                        product.rentalOptions.rent12Months) ? (
                          <h5>
                          <span style={{ textDecoration: "line-through", marginRight: "8px" }}>
                            {"₹ " + (Number(getLowestRentPrice(product.rentalOptions)) * 1.1).toFixed(2)}
                          </span>
                          {"Rent ₹ " + Number(getLowestRentPrice(product.rentalOptions)).toFixed(2) + " onwards"}
                        </h5>
                      ) : (
                        "No rent options"
                      )}
                    </p>
                  </div>
                </div>
              </div>
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

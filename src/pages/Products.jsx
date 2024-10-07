import { useState, useEffect } from "react";
import "../assets/csss/Products.css";
// import RangeSlider from "../components/RangeSlider";
import { getAllProductsAPI } from "../service/products.service";
// import { addToCartAPI } from "../service/cart.service";
const Products = () => {
  const [products, setProducts] = useState([]);
  const [productFilter, setProductFilter] = useState({
    page: 1,
    limit: 8,
    size: 10,
  });

  const [sortOption, setSortOption] = useState("latest"); // State for sorting option

  const getProducts = async () => {
    const { data } = await getAllProductsAPI(
      productFilter.page,
      productFilter.limit,
      productFilter.size
    );

    // Sort the products based on the selected sort option
    const sortedProducts = data.sort((a, b) => {
      if (sortOption === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt); // Sort by latest
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt); // Sort by oldest
      }
    });

    setProducts(sortedProducts);
  };
  useEffect(() => {
    getProducts();
  }, []);
  // const addToCart = async (productData) => {
  //   if (productData) {
  //     const data = addToCartAPI({
  //       items: {
  //         product: productData?._id,
  //         quantity: 1,
  //       },
  //     });
  //     if (data) {
  //       alert("Product added to cart");
  //     }
  //   }
  // };
  // const addToWishlistHandler = (
  //   id,
  //   title,
  //   subTitle,
  //   price,
  //   image,
  //   quantity = 1
  // ) => {
  //   //todo
  // };

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
            {/* <RangeSlider /> */}

            {/* <div className="productpage-left-sidebar-filters">
              <div className="filter-title">Filter by Price</div>
              <div className="checkboxes">
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" name="price-low" value="under-500" />
                    <label htmlFor="price-low">Under ₹500</label>
                  </div>
                  <span>20</span>
                </div>
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" value="500-999" />
                    <label htmlFor="price-low">₹500 - ₹999</label>
                  </div>
                  <span>20</span>
                </div>
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" value="1000-1999" />
                    <label htmlFor="price-low">₹1000 - ₹1999</label>
                  </div>
                  <span>20</span>
                </div>
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" value="2000-3999" />
                    <label htmlFor="price-low">₹2000 - ₹3999</label>
                  </div>
                  <span>20</span>
                </div>
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" value="4000-4999" />
                    <label htmlFor="price-low">₹4000 - ₹4999</label>
                  </div>
                  <span>20</span>
                </div>
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" name="price-low" value="over-5000" />
                    <label htmlFor="price-low">Over ₹5000</label>
                  </div>
                  <span>20</span>
                </div>
              </div>
            </div> */}

            <div className="productpage-left-sidebar-filters bg-white rounded-md shadow-md p-4 ">
              <div className="filter-title text-lg font-semibold mb-4 border-b pb-2">
                Filter by Categories
              </div>
              <div className="checkboxes space-y-4">
                {[
                  { id: "category-appliance", value: "appliance" },
                  { id: "category-sofa", value: "sofa" },
                  { id: "category-kitchen", value: "kitchen" },
                  { id: "category-storage", value: "storage" },
                  { id: "category-bed", value: "bed" },
                  { id: "category-bath", value: "bath" },
                ].map((category) => (
                  <div className="checkbox flex items-center" key={category.id}>
                    <div className="checkbox-grp flex items-center">
                      <input
                        type="checkbox"
                        id={category.id}
                        name="category"
                        value={category.value}
                        className="mr-2 w-5 h-5 accent-blue-500 transition duration-200 ease-in-out transform hover:scale-110"
                      />
                      <label
                        htmlFor={category.id}
                        className="text-md font-medium text-gray-800 "
                      >
                        {category.value.toLocaleUpperCase()}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* <div className="productpage-left-sidebar-filters">
              <div className="filter-title">Filter by Color</div>
              <div className="checkboxes">
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" id="price-low" name="price-low" />
                    <label htmlFor="price-low">White</label>
                  </div>
                  <span>20</span>
                </div>
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" id="price-low" name="price-low" />
                    <label htmlFor="price-low">Black</label>
                  </div>
                  <span>20</span>
                </div>
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" id="price-low" name="price-low" />
                    <label htmlFor="price-low">Grey</label>
                  </div>
                  <span>20</span>
                </div>
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" id="price-low" name="price-low" />
                    <label htmlFor="price-low">Brown</label>
                  </div>
                  <span>20</span>
                </div>
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" id="price-low" name="price-low" />
                    <label htmlFor="price-low">Blue</label>
                  </div>
                  <span>20</span>
                </div>
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" id="price-low" name="price-low" />
                    <label htmlFor="price-low">Green</label>
                  </div>
                  <span>20</span>
                </div>
              </div>
            </div>
            <div className="productpage-left-sidebar-filters">
              <div className="filter-title">Filter by Material</div>
              <div className="checkboxes">
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" id="price-low" name="price-low" />
                    <label htmlFor="price-low">Leather</label>
                  </div>
                  <span>20</span>
                </div>
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" id="price-low" name="price-low" />
                    <label htmlFor="price-low">Marble</label>
                  </div>
                  <span>20</span>
                </div>
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" id="price-low" name="price-low" />
                    <label htmlFor="price-low">Metal</label>
                  </div>
                  <span>20</span>
                </div>
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" id="price-low" name="price-low" />
                    <label htmlFor="price-low">Wood</label>
                  </div>
                  <span>20</span>
                </div>
                <div className="checkbox">
                  <div className="checkbox-grp">
                    <input type="checkbox" id="price-low" name="price-low" />
                    <label htmlFor="price-low">Leatherette</label>
                  </div>
                  <span>20</span>
                </div>
              </div>
            </div> */}
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
                  getProducts(); // Fetch products again with new sort option
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
                      className="rounded-lg w-full h-64 object-cover "
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
                      {/* {"Buy at ₹ " + product.buyPrice} */}
                      {/* <br /> */}
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
                    {/* <button
                      onClick={() => addToCart(product)}
                      className="card-add-button inline-flex items-center justify-center h-10 w-10 text-2xl font-medium text-center text-white bg-[#FEC500] rounded-full cursor-pointer hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-[#FEC500] dark:hover:bg-[#FEC500] dark:focus:ring-[#FEC500]"
                    >
                      +
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="productpage-right-card-grid">
            {/* {products.map((product) => (
              <Link
                to={`/productdetail/${product._id}`}
                className=""
                key={product._id}
              >
                <div className="card-img">
                  <img src={product.img[0]} alt={product.title} />
                </div>
                <div className="cardddd">
                  <div className="card-sqr"></div>
                  <div className="card-details">
                    <span className="card-category">{product.category}</span>
                    <h3 className="card-name">{product.title}</h3>
                    <div className="card-rating"></div>
                   

                    <div className="price-cont">
                      <p className="card-price">
                        <span>₹</span>
                        {product.price}
                      </p>
                      <button
                        className="card-add-button"
                        onClick={() =>
                          addToWishlistHandler(
                            product._id,
                            product.title,
                            product.sub_title || "",
                            product.price,
                            product.img?.[0] || "",
                            1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  
                  </div>
                </div>
              </Link>
            ))} */}
          </div>
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

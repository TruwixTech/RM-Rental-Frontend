/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import logo from "../assets/img/Logo.png";
import { MdShoppingBag } from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import User from "../assets/img/user.png";
import storageService from "../service/storage.service";
import { getCartAPI } from "../service/cart.service";
import AddressSelect from "./DrawerHero";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { FaSearch } from "react-icons/fa";
import { searchProduct } from "../service/products.service";
import Buy_icon from "../assets/img/buy_icon.png";
import Rent_icon from "../assets/img/rent_icon.png";
import cart_text from "../assets/img/cart_text.png"
import bag from "../assets/img/bag.png"
import heart_icon from "../assets/img/heart_icon.png"
import AddressSelect2 from "./DrawerHero2";

const Navbar = ({ active, userClickHandler }) => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("home");
  const user = storageService.get("user");
  const [showPopup, setShowPopup] = useState(false);

  // Show popup every time the page reloads
  useEffect(() => {
    setShowPopup(true);
  }, []);

  const closePopup = () => {
    setShowPopup(false);
  };

  const [cartItems, setCartItems] = useState([]);

  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

  const getMyCart = async () => {
    const data = await getCartAPI(user?._id);
    if (data) {
      setCartItems(data?.data?.items);
    }
  };

  useEffect(() => {
    if (user) {
      let interval = setInterval(() => {
        getMyCart();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, []);

  // Search functionality states
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);

  // Handle search input change and fetch suggestions from the backend
  const handleInputChange = async (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value.length > 0) {
      try {
        const response = await searchProduct(e.target.value);
        setSuggestions(response.data);
        setSuggestionsVisible(true);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestionsVisible(false);
      }
    } else {
      setSuggestions([]); // Clear suggestions
      setSuggestionsVisible(false); // Hide the dropdown
    }
  };


  const handleSuggestionClick = (id) => {
    setSearchTerm("");
    setSuggestionsVisible(false);
    // Navigate to the product page with the product id
    navigate(`/product/${id}`);
  };

  return (
    <div className="mainnavbar">
      <div className="upnavbar">
        <div className="leftnav">
          <div className="logo flex gap-10 items-center">
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
            {/* <div className="hidden md:block">
              <AddressSelect />
            </div> */}
          </div>

          {/* Search Bar */}
          <div className="leftnav-searchbar">
            <FaSearch className="text-[#666] md:size-6 xl:size-5" />
            <input
              type="text"
              placeholder="Search Product"
              className="search-input outline-black"
              value={searchTerm}
              onChange={handleInputChange}
            />
            {/* Display search suggestions */}
            {suggestionsVisible && (
              <ul className="search-suggestions active">
                {suggestions.map((item) => (
                  <li
                    key={item.id}
                    onClick={() => handleSuggestionClick(item.id)}
                    className="search-suggestion-item"
                  >
                    {item.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="rightnav">
          {!user ? (

            <div className="flex items-center gap-4 p-2 rounded-md sm:flex-col sm:gap-2 md:flex-row md:gap-4 lg:gap-6">
              <button className=" relative flex items-center px-4 w-24 h-8 text-sm font-medium text-gray-700 bg-gray-100 rounded-full sm:w-20 sm:h-9 md:w-28 md:h-[52px]">
                Buy
                <span className=" absolute right-0 w-12 h-12 rounded-full bg-gray-200 border hover:bg-gray-500  border-gray-500"></span>
              </button>

              <button className=" relative flex items-center px-4 w-24 h-8 text-sm font-medium text-gray-700 bg-gray-100 rounded-full sm:w-20 sm:h-9 md:w-28 md:h-[52px]">
                Rent
                <span className=" absolute right-0 w-12 h-12 rounded-full bg-gray-200 border hover:bg-gray-500  border-gray-500"></span>
              </button>
              <div className="hidden h-6 bg-gray-300 md:block md:w-px"></div>
              <button className="flex items-center justify-center w-8 h-8 text-gray-600 rounded-full hover:bg-gray-200 sm:w-10 sm:h-10">
                <img
                  src={heart_icon}
                  alt="Heart Icon"
                  className="w-6 h-6"
                />

              </button>


              <div className="hidden h-6 bg-gray-300 md:block md:w-px"></div>
              {/* <button className="flex items-center gap-2 text-sm font-medium text-gray-600 rounded-full hover:text-gray-900 sm:w-full sm:justify-center md:w-auto">
            <img 
              src={bag} 
              alt="Cart Icon" 
              className="w-10 h-10" 
            />
            CART (1)
            </button> */}

              <Link
                className="text-sm font-medium text-gray-700 hover:text-gray-900 sm:text-center"
                to="/login"
              >
                Login
              </Link>
            </div>


          ) : (
            <div className="flex gap-3">
              <div className="cartgroup gap-2">
                {user?.role === "Admin" && (
                  <Link
                    to="/admindashboard"
                    className="border rounded-full px-3 py-2 border-gray-400"
                  >
                    Dashboard
                  </Link>
                )}
                {user.role === "Admin" ? "|" : ""}

                <div
                  className="rightnav-cart relative"
                  onClick={() => navigate("/mycart")}
                >
                  <HiOutlineShoppingBag className="shoping-bag " size={30} />
                  <span className="absolute -top-1 -right-1 bg-[#ffd74d] text-black font-bold text-sm border border-black rounded-full w-6 h-6 flex justify-center items-center">{cartItems?.length}</span>
                </div>
                {/* <div
                  className="font-semibold flex gap-4"
                  onClick={() => navigate("/mycart")}
                >
                  <div className="text-lg md:text-xl">|</div>
                  <div className="text-lg md:text-xl">
                    CART ({cartItems?.length})
                  </div>
                </div> */}
              </div>

              <div
                onClick={userClickHandler}
                className=""
                id="user"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#FEC500",
                  cursor: "pointer",
                  width: "3.5vw",
                  height: "3.5vw",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                {active === false ? (
                  <img className="w-full h-full rounded-full" src={User} alt="" />
                ) : (
                  <IoClose className="text-3xl text-semibold text-black" />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="line-56"></div>
      <div className="bottomnav px-5" style={{ paddingBottom: 0 }}>
        <div className="bottomnav-left btmleft">
          <NavLink
            to="/"
            className={({ isActive }) => `${isActive ? 'active' : ''} text-decoration-none`}
            onClick={() => handleLinkClick("home")}
          >
            <div className="home">Home</div>
          </NavLink>
          {/* <NavLink
            to="/products"
            className={({ isActive }) => `${isActive ? 'active' : ''} text-decoration-none `}
            onClick={() => handleLinkClick("products")}
          >
            <div className="product">Products
          </div>
          </NavLink> */}

          {/* product dropdown  */}
          <div className="relative group inline-block text-left">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `${isActive ? 'active' : ''} text-black font-medium rounded-full text-sm px-3 py-2.5 text-center inline-flex items-center`
              }
              onClick={() => handleLinkClick('products')}
            >
              Products
              <svg
                className="w-2.5 h-2.5 ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </NavLink>
            <div
              id="dropdown"
              className="absolute z-10 hidden group-hover:block bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Product 1
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Product 2
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Product 3
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Product 4
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Catalog */}
          <div className="relative group inline-block text-left">
            <NavLink
              to="/catalogs"
              className={({ isActive }) =>
                `${isActive ? 'active' : ''} text-black font-medium rounded-full text-sm px-3 py-2.5 text-center inline-flex items-center`
              }
              onClick={() => handleLinkClick('catalog')}
            >
              Catalogs
              <svg
                className="w-2.5 h-2.5 ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </NavLink>
            <div
              id="dropdown"
              className="absolute z-10 hidden group-hover:block bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Catalog1
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Catalog2
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Catalog 3
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Catalog 4
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Popular Items */}
          <div className="relative group inline-block text-left">
            <NavLink
              to="/popularItems"
              className={({ isActive }) =>
                `${isActive ? 'active' : ''} text-black font-medium rounded-full text-sm px-3 py-2.5 text-center inline-flex items-center`
              }
              onClick={() => handleLinkClick('Popular Items')}
            >
              Popular Items
              <svg
                className="w-2.5 h-2.5 ms-1"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </NavLink>
            <div
              id="dropdown"
              className="absolute z-10 hidden group-hover:block bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700"
            >
              <ul
                className="py-2 text-sm text-gray-700 dark:text-gray-200"
                aria-labelledby="dropdownDefaultButton"
              >
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Item1
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Item2
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Item 3
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    Item 4
                  </a>
                </li>
              </ul>
            </div>
          </div>
          {/* Rent Furnitures */}
          <NavLink
            to="/rentFurnitures"
            className={({ isActive }) => `${isActive ? 'active' : ''} text-black font-medium rounded-full text-sm px-3 py-2.5 text-center inline-flex items-center`}
            onClick={() => handleLinkClick("Rent Furnitures")}
          >
            <div className="rent-furnitures">Rent Furnitures</div>
          </NavLink>
        </div>

        <div className="bottomnav-right">
          <div className="absolute -right-[1500px]">
            <AddressSelect2 />
          </div>
          <NavLink
            to="/shipping"
            // style={{ overflow: "hidden" }}
            // className={activeLink === "shipping" ? "active" : ""}
            // onClick={() => handleLinkClick("shipping")}
            className={({ isActive }) => `${isActive ? 'active' : ''} text-decoration-none`}
            onClick={() => handleLinkClick("shipping")}

          >
            <span className="renttt text-lg">Shipping</span>

          </NavLink>
          <NavLink to="/returns"
            // style={{ overflow: "hidden" }}
            // className={activeLink === "returns" ? "active" : ""}
            // onClick={() => handleLinkClick("returns")}
            className={({ isActive }) => `${isActive ? 'active' : ''} text-decoration-none`}
            onClick={() => handleLinkClick("returns")}
          >
            <span className="renttt text-lg">Returns</span>

          </NavLink>
          <Link to="/faq"
            style={{ overflow: "hidden" }}
            className={activeLink === "faqs" ? "active" : ""}
            onClick={() => handleLinkClick("faqs")}
          >
            <span className="renttt text-lg">FAQs</span>

          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

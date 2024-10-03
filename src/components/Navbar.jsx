/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import logo from "../assets/img/Logo.png";
import { FaSearch } from "react-icons/fa";
import { MdShoppingBag } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
// import { FaCheck } from "react-icons/fa";
// import { IoTimeSharp } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import User from "../assets/img/user.png";
import storageService from "../service/storage.service";
import { getCartAPI } from "../service/cart.service";

const Navbar = ({ active, userClickHandler }) => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("home");
  const user = storageService.get("user");
  const [cartItems, setCartItems] = useState([]);

  // const [wishlistItems, setWishlistItems] = useState([]);
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };
  const getMyCart = async () => {
    const data = await getCartAPI();
    if (data) setCartItems(data?.items);
  };
  useEffect(() => {
    if (user) {
      let interval = setInterval(() => {
        getMyCart();
      }, 2000);
      return () => clearInterval(interval);
    }
  }, []);
  return (
    <div className="mainnavbar">
      <div className="upnavbar">
        <div className="leftnav">
          <div className="logo">
            <Link to="/">
              <img src={logo} alt="" />
            </Link>
          </div>
          <div className="leftnav-searchbar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search Product"
              className="search-input"
            />
          </div>
        </div>

        <div className="rightnav">
          {/* <div className="buygroup">
            <div className="buy">Buy</div>
            <div className="buy-right">
              <FaCheck />
            </div>
          </div>
          <div className="buygroup">
            <div className="buy">Rent</div>
            <div className="buy-right buy-right-to">
              <IoTimeSharp />
            </div>
          </div> */}

          {/* <div className="rightnav-heart" onClick={() => navigate("/wishlist")}>
            <FaRegHeart className="heart-icon" /> {wishlistItems.length}
          </div> */}

          {!user ? (
            <>
              <Link className="login" to="/login">
                Login
              </Link>
            </>
          ) : (
            <>
              <div className="cartgroup">
                {user?.role === "Admin" && (
                  <Link
                    to="/admindashboard"
                    className="border rounded-full px-3 py-2 border-gray-500"
                  >
                    Dashboard
                  </Link>
                )}
                <div
                  className="rightnav-cart"
                  onClick={() => navigate("/mycart")}
                >
                  <MdShoppingBag className="shoping-bag" /> {cartItems?.length}
                </div>
                <div className="rightnav-cartcount"></div>
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
                to=""
              >
                {active === false ? (
                  <img
                    className="w-full h-full rounded-full"
                    src={User}
                    alt=""
                  />
                ) : (
                  <IoClose className="text-3xl text-semibold text-black" />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="line-56"></div>
      <div className="bottomnav" style={{ paddingBottom: 0 }}>
        <div className="bottomnav-left btmleft">
          <Link
            to="/"
            className={`text-decoration-none ${
              activeLink === "home" ? "active" : ""
            }`}
            onClick={() => handleLinkClick("home")}
          >
            <div className="home">Home</div>
          </Link>
          <Link
            to="/products"
            className={`text-decoration-none ${
              activeLink === "products" ? "active" : ""
            }`}
            onClick={() => handleLinkClick("products")}
          >
            <div className="product">Products</div>
          </Link>

          <select
            className={`bottomnav-left-products ${
              activeLink === "popular" ? "active" : ""
            }`}
            onClick={() => handleLinkClick("popular")}
          >
            <option value="">Popular Items</option>
            <option value="1">1</option>
          </select>

          <Link
            style={{ overflow: "hidden" }}
            className={activeLink === "rent" ? "active" : ""}
            onClick={() => handleLinkClick("rent")}
          >
            <span className="renttt">Rent Furniture</span>
          </Link>

          <Link
            to="/orderdetails"
            className={`text-decoration-none ${
              activeLink === "orders" ? "active" : ""
            }`}
            onClick={() => handleLinkClick("orders")}
          >
            Orders
          </Link>
        </div>

        <div className="bottomnav-right">
          <div
            style={{ overflow: "hidden" }}
            className={activeLink === "shipping" ? "active" : ""}
            onClick={() => handleLinkClick("shipping")}
          >
            <span className="renttt">Shipping</span>
          </div>
          <div
            style={{ overflow: "hidden" }}
            className={activeLink === "returns" ? "active" : ""}
            onClick={() => handleLinkClick("returns")}
          >
            <span className="renttt">Returns</span>
          </div>
          <div
            style={{ overflow: "hidden" }}
            className={activeLink === "faqs" ? "active" : ""}
            onClick={() => handleLinkClick("faqs")}
          >
            <span className="renttt">FAQs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

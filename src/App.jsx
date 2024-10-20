/* eslint-disable no-unused-vars */
import { useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Products from "./pages/Products";
import { Link, Route, Routes, useNavigate } from "react-router-dom";

import SignUp from "./pages/SignUp";

import { RiEdit2Fill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { IoIosHelpCircle } from "react-icons/io";
import { IoLogOutSharp } from "react-icons/io5";
import User from "./assets/img/user.png";

import storageService from "./service/storage.service";
import Login from "./pages/Login";
import Home from "./pages/Home";
import ProductDetails from "./pages/Productdetails";
import MyCart from "./pages/MyCart";
import AddressPage from "./pages/AddressPage";
import UserDashboard from "./pages/UserDashboard";
import MyOrders from "./pages/MyOrders";
import OrderConfirm from "./pages/OrderConfirm";
import AdminDashboard from "./pages/AdminDashboard";
import AdminPage from "./Admin/AdminPage";
import AllProducts from "./Admin/AllProducts";
import AddProduct from "./Admin/AddProduct";
import Orders from "./Admin/Orders";
import KYCPage from "./pages/KYCPage";
import KYCRecords from "./Admin/KYCRecords";
import Contact from "./components/Contact";
import MySubscriptions from "./pages/MySubscriptions";
import ForgotPassword from "./pages/ForgotPassword";


const App = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);
  const [user, setUser] = useState(storageService.get("user"));
  const userClickHandler = () => {
    setActive(!active);
  };

  const handleLogout = () => {
    navigate("/");
    localStorage.removeItem("token");
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div>
      <Navbar active={active} userClickHandler={userClickHandler} />
      <div
        className={`${
          active === false ? "user-slider-off" : "user-slider-on"
        } absolute top-[14.5%]  z-40 rounded-b-xl shadow-md shadow-[#878787] right-0 w-[20vw] h-fit bg-[#fff] text-[#000]`}
      >
        <div className="w-full p-2">
          <ul className="py-1 px-2">
            <li className="username w-full flex items-center gap-2 mb-3 py-2 px-2 rounded-t-lg hover:bg-gray-100 border-b-[1px] border-[#FEC500]">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-[#FEC500]">
                <img className="w-full h-full rounded-full" src={User} alt="" />
              </div>
              <Link
                to="/userdashboard"
                onClick={() => setActive(false)}
                className="block px-2 py-2 font-semibold text-xl"
              >
                {user?.name}
              </Link>
            </li>
            <li className="w-full flex items-center mt-2 py-2 px-2 rounded-lg  hover:bg-gray-100">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FEC500] text-black text-2xl">
                <RiEdit2Fill />
              </div>
              <Link
                to="/userdashboard"
                onClick={() => setActive(false)}
                className="block px-4 py-2"
              >
                Edit Profile
              </Link>
            </li>
            {/* <li className="w-full flex items-center mt-2 py-2 px-2 rounded-lg  hover:bg-gray-100">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FEC500] text-black text-2xl">
                <IoSettings />
              </div>
              <Link href="#" className="block px-4 py-2">
                Setting & Privacy
              </Link>
            </li> */}
            <li className="w-full flex items-center mt-2 py-2 px-2 rounded-lg  hover:bg-gray-100">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FEC500] text-black text-2xl">
                <IoIosHelpCircle />
              </div>
              <Link href="/contact" className="block px-4 py-2">
                Help & Support
              </Link>
            </li>
            <li className="w-full flex items-center mt-2 py-2 px-2 rounded-lg  hover:bg-gray-100">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FEC500] text-black text-2xl">
                <IoLogOutSharp />
              </div>
              <div
                onClick={handleLogout}
                className="block px-4 py-2 cursor-pointer"
              >
                Logout
              </div>
            </li>
          </ul>
        </div>
      </div>
      {user ? (
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/password" element={<ForgotPassword />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/mycart" element={<MyCart />} />
          <Route
            path="/address/finalPayment"
            element={<AddressPage finalPayment={true} />}
          />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/userdashboard" element={<UserDashboard />} />
          <Route path="/orderconfirm" element={<OrderConfirm />} />
          <Route path="/address" element={<AddressPage />} />
          <Route path="/kyc" element={<KYCPage />}></Route>
          <Route path="/payment" element={<MySubscriptions />}></Route>
          {/* <Route path="/admindashboard" element={<AdminDashboard />} /> */}

          <Route path="/admindashboard" element={<AdminDashboard />}>
            <Route index element={<AdminPage />} />
            <Route
              path="allproduct"
              element={<AllProducts />}
            />
            <Route path="addproduct" element={<AddProduct />} />
            <Route path="orders" element={<Orders />} />
            <Route
              path="/admindashboard/kyc-records"
              element={<KYCRecords />}
            />
            {/*  <Route path="coupon" element={<Coupon />} />
            <Route path="categorie" element={<Categories />} />
            <Route path="brands" element={<Brands />} />
            <Route path="orderdetails" element={<OrderDetails />} />
            <Route path="userevents/:userId" element={<UserEvents />} />
            <Route path="updateform" element={<Updateform />} />
            <Route path="approve" element={<Approve />} />
            <Route path="blog" element={<Blog />} />
            <Route path="createblog" element={<Createblog />} /> */}
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/password" element={<ForgotPassword />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
      )}
      <Routes>
        {/* <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/mycart" element={<MyCart />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/productdetail" element={<Productdetails />} />
        <Route path="/productdetail/:id" element={<Productdetails />} />
        <Route path="/success/:id" element={<Success />} />
        <Route path="/orderdetails" element={<Orderdetails />} />
        <Route path="/orderconfirm" element={<OrderConfirm />} />
        <Route path="/orderreject" element={<OrderReject />} />
        <Route path="/orderpending" element={<OrderPending />} />
        <Route path="/thankuorder" element={<ThankuOrder />} />
        <Route path="/address" element={<AddressPage />} />
        <Route
          path="/address/finalPayment"
          element={<AddressPage finalPayment={true} />}
        /> */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;

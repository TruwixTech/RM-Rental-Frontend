import ImageMask from "../components/home_components/ImageMask";
import Textslider from "../components/home_components/Textslider";
import Category from "../components/home_components/Category";
import Rent from "../components/home_components/Rent";
import Page4 from "../components/home_components/Page4";
import Chairs from "../components/home_components/Chairs";
import Page6 from "../components/home_components/Page6";
import Carao from "../components/home_components/Carao";
import "../assets/csss/Home.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Modal = ({ onClose }) => {

  const navigate = useNavigate()

  function navigateToMySubscriptions() {
    navigate("/payment");
  }

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 flex flex-col items-center">
        <h2 className="text-lg font-semibold mb-4 text-center">Subscription Expired</h2>
        <p className="text-center my-1">Your Subscription is Expired Please Renew !!</p>

        <div className="w-full h-auto flex justify-center items-center gap-6">
          <button
            onClick={navigateToMySubscriptions}
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            Activate Now
          </button>
          <button
            onClick={onClose}
            className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  )
};

const Home = () => {
  const [expiredPopup, setExpiredPopup] = useState(false);

  async function fetchUser() {
    try {
      const xyz = JSON.parse(localStorage.getItem("user"))
      const response = await axios.post("https://rmrental-backend.vercel.app/api/user-details", { id: xyz._id });
      const orders = response.data.user.orders;

      // Get today's date (normalized to midnight for accurate comparison)
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to midnight

      // Check if any `endDate` in the orders array is smaller than today's date
      const expiredPopup = orders.some((order) => {
        const endDate = new Date(order.endDate); // Parse the ISO string into a Date object
        return endDate < today; // Check if endDate is earlier than today
      });

      if (expiredPopup) {
        setExpiredPopup(true);
        // Trigger the expiredPopup logic or update state
      } else {
        setExpiredPopup(false);
      }
    } catch (error) {
      console.log("Error while fetching user details:", error);
    }
  }

  function onClose() {
    setExpiredPopup(false)
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <div className="overflow-x-hidden overflow-clip">
      <div className="home1">
        <ImageMask />
        <Category />
      </div>
      <div>
        <Textslider />
      </div>
      <div className="fullrent">
        <Rent />
      </div>
      <Page4 />
      <div className="fullchair">
        <Chairs />
      </div>
      <Page6 />

      <div className="fullcarao">
        <Carao />
      </div>
      {
        expiredPopup && <Modal onClose={onClose} />
      }
    </div>
  );
};

export default Home;

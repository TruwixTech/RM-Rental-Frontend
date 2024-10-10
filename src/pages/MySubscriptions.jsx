/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { FaShoppingBag, FaIdCard } from "react-icons/fa";
import storageService from "../service/storage.service";
import userService from "../service/user.service"; // Import userService for orders

// SubscriptionStatus Component
const SubscriptionStatus = ({ startDate, endDate }) => {
  const endDateObj = new Date(endDate);
  const today = new Date();

  // Check if the endDate is less than today's date
  const isExpired = endDateObj <= today;
  const status = isExpired ? "Expired" : "Active";
  const statusColor = isExpired ? "text-red-500" : "text-green-500";

  return <button className={`status-button ${statusColor}`}>{status}</button>;
};

const MySubscriptions = () => {
  const [activeLink, setActiveLink] = useState("");
  const user = storageService.get("user");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const ClickHandler = (link) => {
    setActiveLink(link);
  };

  const fetchOrders = async () => {
    try {
      const { data } = await userService.getMyOrders(user?._id);
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  // Set active link to "My Orders" when component mounts
  useEffect(() => {
    fetchOrders();
    setActiveLink("My Orders"); // Set active link as "My Orders"
  }, []);

  return (
    <div className="user-profile w-full flex justify-between p-8 bg-[#f1f1f1]">
      <div className="user-profile-left flex flex-col py-8 px-10 w-[20%] shadow-md shadow-[#dadada] bg-white rounded-lg">
        <div className="w-full">
          <h1 className="text-xl font-semibold">Welcome, {user?.name}</h1>
          <p className="text-xs overflow-hidden">{user?.createdAt}</p>
        </div>
        <div className="w-full flex flex-col justify-between">
          <h1 className="my-8 font-medium text-gray-400">Menu</h1>
          <div className="flex flex-col gap-4 links w-full">
            {[
              { icon: <FaShoppingBag />, name: "My Orders", url: "/myorders" },
              { icon: <FaIdCard />, name: "KYC", url: "/kyc" },
              {
                icon: <RiMoneyRupeeCircleFill />,
                name: "Payment",
                url: "/payment",
              },
              // { icon: <IoSettings />, name: "Setting", url: "/setting" },
            ].map((item, index) => (
              <Link
                to={item.url}
                key={index}
                onClick={() => ClickHandler(item.name)}
                className={`${
                  activeLink === item.name
                    ? "text-black font-semibold"
                    : "text-[grey]"
                } flex items-center gap-3 text-xl`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-between sm:w-full md:w-[76%] p-8 bg-white shadow-md shadow-[#dadada] rounded-lg">
        {loading ? (
          <p>Loading Subscriptions...</p>
        ) : (
          <div className="flex flex-col items-start w-full">
            <div className="text-2xl font-semibold mb-4">My Subscriptions</div>
            {orders.length > 0 ? (
              <div className="order-list w-full">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full mb-6">
                    <thead>
                      <tr>
                        <th className="w-1/5 px-3">Order ID</th>
                        <th className="w-1/5 px-3">Start Date</th>
                        <th className="w-1/5 px-3">End Date</th>
                        <th className="w-1/5 px-3">Amount</th>
                        <th className="w-1/5 px-3">Status</th>
                        <th className="w-1/5 px-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => {
                        const startDate = new Date(order.orderDate); // Use the correct start date (orderDate)
                        const endDate = new Date(order.endDate);

                        return (
                          <tr
                            key={order?._id}
                            className="border-b border-gray-200"
                          >
                            <td className="whitespace-nowrap px-3 py-2">
                              {order._id}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              {new Date(order.orderDate).toDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              {new Date(order.endDate).toDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              Rs. {order.totalPrice.toFixed(2)}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              <SubscriptionStatus
                                startDate={order.orderDate}
                                endDate={order.endDate}
                              />
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              <button
                                className={`rounded-lg py-2 px-2 ${
                                  endDate <= new Date()
                                    ? "bg-green-600"
                                    : "bg-gray-400 cursor-not-allowed"
                                } text-white`}
                                disabled={endDate > new Date()} // Disable if endDate is greater than today
                              >
                                Pay Now
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p>No subscriptions found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubscriptions;

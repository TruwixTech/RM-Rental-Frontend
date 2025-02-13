/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { FaShoppingBag, FaIdCard } from "react-icons/fa";
import storageService from "../service/storage.service";
import userService from "../service/user.service"; // Import userService for orders
import { AXIOS_INSTANCE } from "../service";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";


// const backend = "https://truwix-rm-rental-backend-dev.vercel.app/api"
const backend = "http://localhost:4000/api"


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
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const { transactionId } = useParams()
  const navigate = useNavigate()

  const ClickHandler = (link) => {
    setActiveLink(link);
  };

  const removeTransactionIdFromUrl = () => {
    // Use navigate with the `replace` option to remove the `transactionId` from the URL
    navigate('/payment', { replace: true }); // `.` indicates the current route, `replace` prevents adding a new history entry
  };

  const fetchOrders = async () => {
    try {
      const { data } = await userService.getMyOrders(user?._id);
      const filteredOrders = data.filter((order) => order.paymentStatus === "PAID");
      setOrders(filteredOrders);
    } catch (error) {

    }
    setLoading(false);
  };

  const fetchPaymentStatus = async () => {
    try {
      if (transactionId) {
        // console.log(transactionId);
        // console.log(selectedOrderId);

        // Fetch the payment status from the backend
        const transactionresponse = await AXIOS_INSTANCE.get(`${backend}/order/update-status`, {
          params: { id: transactionId }, // Send transactionId as query parameter
        }, {
          data: { orderId: selectedOrderId }, // Send orderId in the request body
        });
        if (transactionresponse.data.success) {
          setSelectedOrderId(null)
          alert("Payment successful and order updated.")
        } else {
          setSelectedOrderId(null)
          alert("Payment failed and order not updated.")
        }
      }
    } catch (error) {
      console.error("Error fetching payment status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Set active link to "My Orders" when component mounts
  useEffect(() => {
    fetchOrders();
    setActiveLink("My Orders"); // Set active link as "My Orders"
  }, []);

  const handlePayNow = async (orderId, rent) => {
    setSelectedOrderId(orderId)
    if (!user) {
      alert("Please login to continue");
      return;
    }
    try {
      // Calculate the amount to be charged
      const orderDetails = {
        totalPrice: rent.toFixed(0), // The total amount from your payment route
        MUID: "M" + Date.now(),
        transactionId: "T" + Date.now(),
      };

      const response = await AXIOS_INSTANCE.put(`${backend}/order/update/${orderId}`, orderDetails);
      if (response.data && response.data.data && response.data.data.instrumentResponse) {
        const redirectInfo = response.data.data.instrumentResponse.redirectInfo;

        if (redirectInfo && redirectInfo.url) {
          // Redirect the user to the payment gateway URL
          window.location.href = redirectInfo.url;
        } else {
          console.log("Redirect URL not found in the response");
          // Optionally, notify the user that payment initiation failed.
        }
      } else {
        console.log("Invalid response structure from payment gateway");
        // Optionally, notify the user of an error with payment initiation.
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      alert("An error occurred during the payment process.");
    }
  };

  useEffect(() => {
    if (transactionId) {
      removeTransactionIdFromUrl()
      fetchPaymentStatus()
    }
  }, [transactionId])

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
              { icon: <LiaFileInvoiceDollarSolid />, name: "Invoices", url: "/my-invoices" },
              // { icon: <IoSettings />, name: "Setting", url: "/setting" },
            ].map((item, index) => (
              <NavLink
                to={item.url}
                key={index}
                onClick={() => ClickHandler(item.name)}
                className={({ isActive }) =>
                  `flex items-center gap-3 text-xl w-full ${isActive
                    ? "text-black font-semibold"
                    : "text-[grey]"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
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
            {orders?.length > 0 ? (
              <div className="order-list w-full">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full mb-6">
                    <thead>
                      <tr>
                        <th className="w-1/5 px-3">Order ID</th>
                        <th className="w-1/5 px-3">Start Date</th>
                        <th className="w-1/5 px-3">End Date</th>
                        <th className="w-1/5 px-3">Rent Amount</th>
                        <th className="w-1/5 px-3">Security</th>
                        <th className="w-1/5 px-3">Shipping</th>
                        <th className="w-1/5 px-3">Status</th>
                        <th className="w-1/5 px-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders?.map((order) => {
                        const startDate = new Date(order.orderDate); // Use the correct start date (orderDate)
                        const endDate = new Date(order.endDate);

                        return (
                          <tr
                            key={order?._id}
                            className="border-b border-gray-200"
                          >
                            <td className="whitespace-nowrap px-3 py-2">
                              {order.orderNumber}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              {new Date(order.orderDate).toDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              {new Date(order.endDate).toDateString()}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              Rs. {order?.furnitureRent}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              Rs. {order?.securityDeposit}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              Rs. {order?.shippingCost}
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              <SubscriptionStatus
                                startDate={order.orderDate}
                                endDate={order.endDate}
                              />
                            </td>
                            <td className="whitespace-nowrap px-3 py-2">
                              <button
                                className={`rounded-lg py-2 px-2 ${endDate <= new Date()
                                  ? "bg-green-600"
                                  : "bg-gray-400 cursor-not-allowed"
                                  } text-white`}
                                disabled={endDate > new Date()} // Disable if endDate is greater than today
                                onClick={() =>
                                  handlePayNow(
                                    order._id,
                                    order.furnitureRent,
                                  )
                                }
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

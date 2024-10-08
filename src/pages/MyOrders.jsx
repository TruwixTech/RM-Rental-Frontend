/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { FaShoppingBag, FaIdCard } from "react-icons/fa";
import storageService from "../service/storage.service";
import userService from "../service/user.service"; // Import userService for orders
import emailjs from "emailjs-com"; // Import EmailJS
import toast from "react-hot-toast";

const MyOrders = () => {
  const [activeLink, setActiveLink] = useState("");
  const user = storageService.get("user");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [editingSubscription, setEditingSubscription] = useState(null); // State for the form
  const [formData, setFormData] = useState({
    subject: "",
    type: "",
    message: "",
  }); // Form data state

  const ClickHandler = (link) => {
    setActiveLink(link);
  };

  const fetchOrders = async () => {
    try {
      const { data } = await userService.getMyOrders();
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

  // Close modal
  const closeModal = () => {
    setEditingSubscription(null);
    setFormData({ subject: "", type: "", message: "" }); // Reset form data
  };

  // Handle form submit
  const handleSubmit = (orderId) => {
    const order = orders.find((order) => order._id === orderId);
    const orderAmount = order ? order.totalPrice : 0; // Get the order amount from the order

    const templateParams = {
      to_name: "Daradesuraj",
      from_name: user?.name,
      to_email: "daradesuraj05@gmail.com",
      subject: formData.subject,
      order_id: orderId,
      order_amount: orderAmount, // Include order amount here
      type: formData.type,
      message: formData.message,
      user_email: user?.email,
      user_mobile: user?.mobileNumber, // Assuming user object has a mobile property
    };

    emailjs
      .send(
        "YOUR_SERVICE_ID",
        "YOUR_TEMPLATE_ID",
        templateParams,
        "YOUR_USER_ID"
      )
      .then((response) => {
        // console.log("Email sent successfully:", response);
        toast.success("Service Request Sent Successfully");
        closeModal(); // Close modal on successful send
      })
      .catch((error) => {
        toast.error("Failed to Send Service Request");
        // console.error("Failed to send email:", error);
      });
  };

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
              { icon: <IoSettings />, name: "Setting", url: "/setting" },
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
          <p>Loading Orders...</p>
        ) : (
          <div className="flex flex-col items-start w-full">
            <div className="text-2xl font-semibold mb-4">My Orders</div>
            {orders.length > 0 ? (
              <div className="order-list w-full">
                <div className="overflow-x-auto">
                  <table className="table-auto w-full mb-6">
                    <thead>
                      <tr>
                        <th className="w-1/5 px-3">Order ID</th>
                        <th className="w-1/5 px-3">Order Date</th>
                        <th className="w-1/6 px-1">Order Amount</th>
                        <th className="w-1/6 px-1">Status</th>
                        <th className="w-1/5 px-3">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order?._id}
                          className="border-b border-gray-200"
                        >
                          <td className="whitespace-nowrap px-3 py-2">
                            {order._id}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2">
                            {new Date(order.createdAt).toDateString()}
                          </td>
                          <td className="whitespace-nowrap px-1 py-2">
                            Rs.{order.totalPrice}
                          </td>
                          <td className="whitespace-nowrap px-1 py-2">
                            {order.status}
                          </td>
                          <td className="flex gap-2">
                            <button
                              onClick={() => {
                                navigate("/orderconfirm", {
                                  state: { orderId: order._id },
                                });
                              }}
                              className="btn btn-primary"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => {
                                setEditingSubscription(order); // Set order to be edited
                              }}
                              className="btn btn-secondary"
                            >
                              Return / Complaint
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        )}
      </div>
      {/* Modal Form for Return / Complaint */}
      {editingSubscription && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          {" "}
          {/* Full-screen overlay */}
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            {" "}
            {/* Modal container */}
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={closeModal}
            >
              &times;
            </button>
            <p className="text-2xl font-semibold mb-4">
              Return / Complaint Form
            </p>
            <div className="flex flex-col space-y-4">
              {" "}
              {/* Space between fields */}
              <div className="flex items-center gap-2">
                <label htmlFor="subject" className="flex-shrink-0 font-medium">
                  Subject:
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="border border-gray-300 rounded-md p-1 flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="type" className="flex-shrink-0 font-medium">
                  Type:
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="border border-gray-300 rounded-md p-1 flex-1"
                  required
                >
                  <option value="">Select</option>
                  <option value="Return">Return</option>
                  <option value="Complaint">Complaint</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="message" className="flex-shrink-0 font-medium">
                  Message:
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="border border-gray-300 rounded-md p-1 flex-1"
                  required
                />
              </div>
              <button
                className="bg-green-500 text-white rounded-md py-2 cursor-pointer"
                onClick={() => handleSubmit(editingSubscription._id)} // Pass order ID to handleSubmit
              >
                Submit
              </button>
              <button
                type="button"
                className="w-full my-1 bg-red-500 text-white rounded-md py-2 cursor-pointer"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;

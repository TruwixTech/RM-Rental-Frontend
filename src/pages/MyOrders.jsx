/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { RiMoneyRupeeCircleFill } from "react-icons/ri";
import { IoSettings } from "react-icons/io5";
import { FaShoppingBag, FaIdCard } from "react-icons/fa";
import storageService from "../service/storage.service";
import userService from "../service/user.service"; // Import userService for orders
import emailjs from "emailjs-com"; // Import EmailJS
import toast from "react-hot-toast";
import $ from "jquery";
import "../assets/csss/MyOrders.css";

const MyOrders = () => {
  const [activeLink, setActiveLink] = useState("");
  const user = storageService.get("user");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  // const navigate = useNavigate();
  const [editingSubscription, setEditingSubscription] = useState(null); // State for the form
  const [formData, setFormData] = useState({
    subject: "",
    type: "",
    message: "",
    product: "All", // Default to 'All'
    pickupDate: "", // State for pickup date
  }); // Form data state
  const [products, setProducts] = useState([]);
  const [deleteOrderId, setDeleteOrderId] = useState();
  const form = useRef();

  const ClickHandler = (link) => {
    setActiveLink(link);
  };

  const fetchOrders = async () => {
    try {
      const { data } = await userService.getMyOrders(user?._id);
      setOrders(data);
    } catch (error) {
      
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    setActiveLink("My Orders");
  }, []);

  const closeModal = () => {
    setEditingSubscription(null);
    setFormData({
      subject: "",
      type: "",
      message: "",
      product: "All",
      pickupDate: "",
    });
    setProducts([]); // Reset products when modal closes
  };

  const openDeleteModal = (orderId) => {
    setDeleteOrderId(orderId);
    $("#deleteModal").fadeIn();
    $(".overlay").fadeIn();
  };

  const closeDeleteModal = () => {
    $("#deleteModal").fadeOut();
    $(".overlay").fadeOut();
  };

  const fetchProductsForOrder = async (orderId) => {
    try {
      const data = await userService.getOrderProducts(orderId);
     
      setProducts(data.data); // Assuming the API returns a list of product names
    } catch (error) {
    
      toast.error("Failed to fetch products");
    }
  };

  const handleCancelOrder = async () => {
    try {
      const data = await userService.cancelOrder(deleteOrderId);
      toast.success("Order Cancelled");
      $("#deleteModal").fadeOut();
      $(".overlay").fadeOut();
      setDeleteOrderId();
      fetchOrders();
    } catch (error) {
      
      toast.error("Failed to cancel order");
    }
  };

  const closeEditForm = () => {
    $("#deleteModal").fadeOut();
    $(".overlay").fadeOut();
  };

  const handleSubmit = (orderId) => {
    setLoading(true);
    const selectedProducts =
      formData.product.length > 0
        ? formData.product.join(", ")
        : "No products selected";

    // Add selected products to form data for the email template
    const templateParams = {
      name: formData.name,
      subject: formData.subject,
      type: formData.type,
      message: formData.message,
      product: selectedProducts, // Send the selected products or 'No products selected'
      pickupDate: formData.pickupDate,
      email: formData.email,
    };

    emailjs
      .sendForm(
        "service_4ef1465",
        "template_4r16o6k",
        form.current,
        "kjKv0FoUnqquZpgTb",
        templateParams // Pass the template parameters to emailjs
      )
      .then(
        (result) => {
          toast.success("Service Request Sent Successfully");
          closeModal();
        },
        (error) => {
          toast.error("Something Went Wrong");
        }
      );
    setLoading(false);
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
                        <th className="w-1/6 px-1">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr
                          key={order?._id}
                          className="border-b border-gray-200"
                        >
                          <td className="whitespace-nowrap px-3 py-2">
                            {order.orderNumber}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2">
                            {new Date(order.createdAt).toDateString()}
                          </td>
                          <td className="whitespace-nowrap px-1 py-2">
                            Rs. {order.totalPrice.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-1 py-2">
                            {order.status}
                          </td>
                          <td className="flex gap-2">
                            {order.status === "delivered" && (
                              <button
                                onClick={() => {
                                  setEditingSubscription(order);
                                  fetchProductsForOrder(order?._id); // Fetch products for this order
                                }}
                                className="rounded-lg py-2 px-2 bg-red-600 text-white my-1"
                              >
                                Return / Complaint
                              </button>
                            )}
                            {order.status !== "delivered" &&
                              order.status !== "cancelled" && (
                                <button
                                  onClick={() => openDeleteModal(order?._id)}
                                  className="rounded-lg py-2 px-2 bg-gray-400 text-white my-1"
                                >
                                  Cancel
                                </button>
                              )}
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
      {editingSubscription && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <button
              className="absolute top-2 right-2 text-gray-600"
              onClick={closeModal}
            >
              &times;
            </button>
            <p className="text-2xl font-semibold mb-4">
              Return / Complaint Form
            </p>
            <form
              ref={form}
              className="flex flex-col space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(editingSubscription._id);
              }}
            >
              <div className="flex items-center gap-2">
                <label htmlFor="name" className="font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="border w-[70%] border-gray-300 rounded-md px-2 flex-1"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="email" className="font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="border w-[70%] border-gray-300 rounded-md px-2 flex-1"
                  required
                />
              </div>
              <div className="flex gap-2">
                <label htmlFor="type" className="mr-2 font-medium">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="border w-[70%] border-gray-300 rounded-md px-2 flex-1"
                  required
                >
                  <option value="">Select</option>
                  <option value="Return">Return</option>
                  <option value="Complaint">Complaint</option>
                </select>
              </div>

              {/* Product Selection */}
              <div className="flex flex-col gap-2">
                <label className="font-medium">Select Products</label>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="selectAll"
                    onChange={(e) => {
                      if (e.target.checked) {
                        // Select all products
                        setFormData({
                          ...formData,
                          product: products.map((product) => product),
                        });
                      } else {
                        // Deselect all
                        setFormData({ ...formData, product: [] });
                      }
                    }}
                  />
                  <label htmlFor="selectAll" className="ml-2">
                    Select All
                  </label>
                </div>

                {/* List all products with checkboxes */}
                {products.map((product, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`product-${index}`}
                      value={product}
                      checked={formData.product.includes(product)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Add product to the selected list
                          setFormData({
                            ...formData,
                            product: [...formData.product, product],
                          });
                        } else {
                          // Remove product from the selected list
                          setFormData({
                            ...formData,
                            product: formData.product.filter(
                              (p) => p !== product
                            ),
                          });
                        }
                      }}
                    />
                    <label htmlFor={`product-${index}`} className="ml-2">
                      {product}
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <label htmlFor="pickupDate" className="font-medium">
                  Pickup Date
                </label>
                <input
                  type="date"
                  id="pickupDate"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={(e) =>
                    setFormData({ ...formData, pickupDate: e.target.value })
                  }
                  className="border w-[70%] border-gray-300 rounded-md px-2 flex-1"
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="border border-gray-300 rounded-md p-1 flex-1"
                  required
                  rows={4}
                />
              </div>

              <button
                className={`bg-green-500 text-white rounded-md py-2 ${
                  loading ? "cursor-not-allowed" : "cursor-pointer"
                }`}
                disabled={loading}
              >
                {loading ? <div>Sending...</div> : <div>Send</div>}
              </button>
              <button
                type="button"
                className="w-full my-1 bg-red-500 text-white rounded-md py-2 cursor-pointer"
                onClick={closeModal}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="overlay" onClick={closeEditForm}></div>

      {/* Delete Modal */}
      <div id="deleteModal">
        <h2 className="pb-4 text-xl">Cancel Order</h2>
        <p className="pb-4">Action can not be undone!</p>
        <button
          type="submit"
          onClick={handleCancelOrder}
          className="confirm-btn"
        >
          Yes
        </button>
        <button onClick={closeDeleteModal} className="cancel-btn">
          No
        </button>
      </div>
    </div>
  );
};

export default MyOrders;
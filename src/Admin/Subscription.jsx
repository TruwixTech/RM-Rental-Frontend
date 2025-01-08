/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import $ from "jquery"; // Import jQuery
import { AXIOS_INSTANCE } from "../service";
import toast from "react-hot-toast";


const Modal = ({ title, children, onClose }) => {
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [newStartDate, setNewStartDate] = useState("");
  const [newOrderDate, setNewOrderDate] = useState(new Date());
  const [newOrderEndDate, setNewOrderEndDate] = useState(new Date());

  const handleStatusClick = (subscription) => {
    setEditingSubscription(subscription);
    setNewOrderDate(new Date(subscription.orderDate)); // Set the start date
    setNewOrderEndDate(new Date(subscription.endDate)); // Set the correct end date
    $(".status-form-overlay").show();
  };

  const handleUpdate = async (id) => {
    try {
      const response = await AXIOS_INSTANCE.put(`/orders/${id}`, {
        orderDate: newOrderDate.toISOString(),
        endDate: newOrderEndDate.toISOString(), // Include endDate in the same object
      });

      if (response.status === 200) {
        toast.success("Subscription updated successfully");
        window.location.reload();
        closeModal(); // Close the modal after successful update
      } else {
        toast.error("Failed to update order");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const closeModal = () => {
    setEditingSubscription(null);
    setNewStartDate("");
    $(".status-form-overlay").hide(); // Hide the overlay when closing
  };

  const SubscriptionStatus = ({ startDate, endDate }) => {

    const endDateObj = new Date(endDate);
    const today = new Date();

    // Check if the endDate is less than today's date
    const isExpired = endDateObj <= today;
    const status = isExpired ? "Expired" : "Active";
    const statusColor = isExpired ? "text-red-500" : "text-green-500";

    return <button className={`status-button ${statusColor}`}>{status}</button>;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-500";
      case "kyc_verified":
        return "text-blue-500"; // Add color for KYC Verified
      case "shipped":
        return "text-orange-500";
      case "cancelled":
        return "text-red-500";
      case "delivered":
        return "text-green-500"; // Add color for Delivered
      default:
        return "text-gray-500"; // Fallback color
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 min-h-[5  it00px] overflow-y-scroll ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[85%] flex flex-col items-center ">
        <h2 className="text-xl font-semibold mb-4 text-center">{title}</h2>
        <table className="subscriptions-table w-full mt-6 border-collapse border border-gray-300 shadow-lg rounded-lg ">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-center px-4 py-3 text-gray-700 font-semibold">Order ID</th>
              <th className="text-center px-4 py-3 text-gray-700 font-semibold">User Name</th>
              <th className="text-center px-4 py-3 text-gray-700 font-semibold">Products</th>
              <th className="text-center px-4 py-3 text-gray-700 font-semibold">Start Date</th>
              <th className="text-center px-4 py-3 text-gray-700 font-semibold">End Date</th>
              <th className="text-center px-4 py-3 text-gray-700 font-semibold">Subscription Status</th>
              <th className="text-center px-4 py-3 text-gray-700 font-semibold">Order Status</th>
              <th className="text-center px-4 py-3 text-gray-700 font-semibold">Update</th>
            </tr>
          </thead>
          <tbody>
            {children.orders.map((sub) => (
              <tr
                key={sub.customerId}
                className="border-b border-gray-300 hover:bg-gray-100 duration-300 ease-in-out"
              >
                <td className="text-center px-4 py-3">{sub.orderNumber}</td>
                <td className="text-center px-4 py-3">{children.name}</td>
                <td className="text-center px-4 py-3 text-sm">
                  {sub.products.map((product, index) => (
                    <div key={product._id || index} className="text-gray-800">
                      {product.product.title}
                    </div>
                  ))}
                </td>
                <td className="text-center px-4 py-3">
                  {new Date(sub.orderDate).toDateString()}
                </td>
                <td className="text-center px-4 py-3">
                  {new Date(sub.endDate).toDateString()}
                </td>
                <td className="text-center px-4 py-3 text-green-500 font-semibold">
                  <SubscriptionStatus
                    startDate={sub.orderDate}
                    endDate={sub.endDate}
                  />
                </td>
                <td className={`${getStatusColor(sub.status)} text-center px-4 py-3`} >{sub.status}</td>
                <td className="text-center px-4 py-3">
                  <button
                    className="w-[100px] rounded-full bg-gray-600 text-white py-2 hover:bg-gray-700 transition duration-200"
                    onClick={() => handleStatusClick(sub)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Modal for editing subscription */}
        <div
          className="status-form-overlay"
          style={{ display: editingSubscription ? "block" : "none" }}
        >
          <div className="status-form w-full flex justify-center flex-col items-center">
            <button className="status-form-close" onClick={closeModal}>
              &times;
            </button>
            <p className="text-2xl my-2">Update Subscription Duration</p>
            <div>
              <div className="flex flex-col justify-center items-center">
                {editingSubscription ? (
                  <p>{editingSubscription._id}</p>
                ) : (
                  <p>Loading...</p>
                )}
                <div className="flex items-center gap-4 my-2">
                  <label htmlFor="startDate" className="flex items-center">
                    Start Date:
                  </label>
                  <input
                    type="date"
                    value={newOrderDate.toISOString().substring(0, 10)}
                    onChange={(e) => setNewOrderDate(new Date(e.target.value))}
                    className="flex items-center border border-gray-300 rounded-md p-1"
                  />
                </div>
                <div className="flex items-center gap-4 my-2">
                  <label htmlFor="endDate" className="flex items-center">
                    End Date:
                  </label>
                  <input
                    type="date"
                    value={newOrderEndDate.toISOString().substring(0, 10)}
                    onChange={(e) => setNewOrderEndDate(new Date(e.target.value))}
                    className="flex items-center border border-gray-300 rounded-md p-1"
                  />
                </div>
              </div>
              <div
                className="w-full my-1 bg-green-500 text-white p-2 rounded-md cursor-pointer flex justify-center items-center"
                onClick={() => handleUpdate(editingSubscription._id)}
              >
                Update
              </div>
              <button type="button" className="w-full my-1" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Close
        </button>
        
      </div>
    </div>
  )
}
const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ordersPopUp, setOrdersPopUp] = useState(false);
  const [singleCustomer, setSingleCustomer] = useState({});

  const fetchSubscriptions = async () => {
    try {
      const response = await AXIOS_INSTANCE.get("/getCustomerWithOrders");
      if (response?.data && Array.isArray(response?.data?.custWthOrders)) {
        // console.log(response.data.custWthOrders);
        setSubscriptions(response.data.custWthOrders);
      } else {
        console.error("Unexpected response format:", response.data);
        setError("Unexpected response format");
      }
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions(); // Initially fetch subscriptions
  }, []);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="subscriptions-container">
        <h1 className="text-4xl font-bold text-gray-400">Subscriptions</h1>

        <table className="subscriptions-table w-full flex justify-center mt-6 flex-col">
          <thead>
            <tr className="w-full flex gap-6">
              <th className="text-center w-full">Customer ID</th>
              <th className="text-center w-full">User Name</th>
              <th className="text-center w-full">User Email</th>
              {/* <th className="text-center w-full">Start Date</th>
            <th className="text-center w-full">End Date</th> */}
              <th className="text-center w-full">Mobile Number</th>
              {/* <th className="text-center w-full">Update</th> */}
            </tr>
          </thead>
          <tbody className="w-full mt-2">
            {subscriptions.length > 0 ? (
              subscriptions.map((sub) => {
                return (
                  <tr key={sub._id} onClick={() => { setOrdersPopUp(true), setSingleCustomer(sub) }} className="flex gap-6 md:hover:bg-gray-100 py-2 cursor-pointer duration-300 ease-in-out text-sm mt-1 items-center ">
                    <td className="text-center w-full">
                      {sub.customerId}
                    </td>
                    <td className=" text-center w-full">{sub.name}</td>
                    <td className=" text-center w-full">{sub.email}</td>
                    {/* <td className=" text-center w-full">
                    {new Date(sub.orderDate).toDateString()}
                  </td>
                  <td className=" text-center w-full">
                    {new Date(sub.endDate).toDateString()}
                  </td> */}
                    <td className="text-center w-full">
                      {sub.mobileNumber}
                    </td>
                    {/* <td className=" text-center w-full text-red-500">
                    <SubscriptionStatus
                      startDate={sub.orderDate}
                      endDate={sub.endDate}
                    />
                  </td> */}
                    {/* <td className="w-full text-center ">
                    <button className="w-[100px] rounded-full bg-gray-600 text-white py-1" onClick={() => handleStatusClick(sub)}>Edit</button>
                  </td> */}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7">No subscriptions available.</td>
              </tr>
            )}
          </tbody>
        </table>

      </div>
      {
        ordersPopUp && <Modal onClose={() => { setOrdersPopUp(false); setSingleCustomer({}) }} title="Orders" children={singleCustomer} />
      }
    </>
  );
};

export default Subscription;

/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import $ from "jquery"; // Import jQuery
import { AXIOS_INSTANCE } from "../service";
import toast from "react-hot-toast";

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSubscription, setEditingSubscription] = useState(null);
  const [newStartDate, setNewStartDate] = useState("");
  const [filter, setFilter] = useState("all");
  const [newOrderDate, setNewOrderDate] = useState(new Date());
  const [newOrderEndDate, setNewOrderEndDate] = useState(new Date());

  const fetchSubscriptions = async () => {
    try {
      const response = await AXIOS_INSTANCE.get("/orders");
      if (response.data && Array.isArray(response.data.data)) {
        setSubscriptions(response.data.data);
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
        fetchSubscriptions();
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

  // Filter active and expired subscriptions based on the new criteria
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const today = new Date();
    const startDateObj = new Date(sub.orderDate);
    const endDateObj = new Date(sub.endDate);

    // Calculate the difference between startDate and endDate in days
    const timeDifference = Math.abs(endDateObj - startDateObj);
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Convert time difference to days

    // Determine if the subscription is expired
    const isExpired = today >= endDateObj || daysDifference > 30;

    if (filter === "active") return !isExpired; // Active subscriptions
    if (filter === "expired") return isExpired; // Expired subscriptions
    return true; // If no filter is applied, return all subscriptions
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="subscriptions-container">
      <h1 className="text-4xl font-bold text-gray-400">Subscriptions</h1>

      <div className="subscription-tabs flex gap-20 my-8">
        <button
          className={`text-base uppercase ${
            filter === "all" ? "active text-black font-bold" : "text-gray-400"
          }`}
          onClick={() => setFilter("all")}
        >
          All Subscriptions
        </button>
        <button
          className={`text-base uppercase ${
            filter === "active"
              ? "active text-black font-bold"
              : "text-gray-400"
          }`}
          onClick={() => setFilter("active")}
        >
          Active Subscriptions
        </button>
        <button
          className={`text-base uppercase ${
            filter === "expired"
              ? "active text-black font-bold"
              : "text-gray-400"
          }`}
          onClick={() => setFilter("expired")}
        >
          Expired Subscriptions
        </button>
      </div>

      <table className="subscriptions-table w-full flex justify-center flex-col">
        <thead>
          <tr className="w-full flex gap-6">
            <th className="text-center w-full">Order ID</th>
            <th className="text-center w-full">User Name</th>
            <th className="text-center w-full">User Email</th>
            <th className="text-center w-full">Start Date</th>
            <th className="text-center w-full">End Date</th>
            <th className="text-center w-full">Status</th>
            <th className="text-center w-full">Update</th>
          </tr>
        </thead>
        <tbody className="w-full">
          {filteredSubscriptions.length > 0 ? (
            filteredSubscriptions.map((sub) => {
              return (
                <tr key={sub._id} className="flex gap-6">
                  <td className="text-center w-full">
                   {sub.orderNumber}
                  </td>
                  <td className=" text-center w-full">{sub.user.name}</td>
                  <td className=" text-center w-full">{sub.user.email}</td>
                  <td className=" text-center w-full">
                    {new Date(sub.orderDate).toDateString()}
                  </td>
                  <td className=" text-center w-full">
                    {new Date(sub.endDate).toDateString()}
                  </td>
                  <td className=" text-center w-full text-red-500">
                    <SubscriptionStatus
                      startDate={sub.orderDate}
                      endDate={sub.endDate}
                    />
                  </td>
                  <td className="w-full text-center ">
                    <button onClick={() => handleStatusClick(sub)}>Edit</button>
                  </td>
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
    </div>
  );
};

export default Subscription;

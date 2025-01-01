/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import $ from "jquery"; // Import jQuery
import "../Admin/Csss/Orders.css";
import { AXIOS_INSTANCE } from "../service";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null); // State to track the order being edited
  const [newStatus, setNewStatus] = useState(""); // State to store new status
  const [currentPage, setCurrentPage] = useState(1); // State to manage the current page
  const [ordersPerPage] = useState(5); // Number of orders to display per page

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await AXIOS_INSTANCE.get("/orders");
        // console.log("API Response:", response.data);
        if (response.data && Array.isArray(response.data.data)) {
          setOrders(response.data.data);
        } else {
          console.error("Unexpected response format:", response.data);
          setError("Unexpected response format");
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusClick = (order) => {
    setEditingOrder(order);
    setNewStatus(order.status);
    $(".status-form-update").show();
  };

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!editingOrder) return;

    try {
      await AXIOS_INSTANCE.put(`/admin/orders/update`, {
        orderId: editingOrder._id, // Send the order ID
        newStatus: newStatus.trim(), // Send the new status
      });

      toast.success("Order status updated successfully");

      setOrders(
        orders.map((order) =>
          order._id === editingOrder._id
            ? { ...order, status: newStatus }
            : order
        )
      );
      setEditingOrder(null);
      setNewStatus("");
      $(".status-form-update").hide();
    } catch (err) {
      console.error("Error updating order status:", err);
      setError(err);
    }
  };

  const closeModal = () => {
    setEditingOrder(null);
    setNewStatus("");
    $(".status-form-update").hide();
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "kyc_verified":
        return "bg-blue-500"; // Add color for KYC Verified
      case "shipped":
        return "bg-orange-500";
      case "cancelled":
        return "bg-red-500";
      case "delivered":
        return "bg-green-500"; // Add color for Delivered
      default:
        return "bg-gray-500"; // Fallback color
    }
  };

  return (
    <div className="orders-container">
      <h1>Orders</h1>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Total Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.length > 0 ? (
            currentOrders.map((order) => (
              <tr key={order._id}>
                <td>{order.orderNumber}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>₹ {order.totalPrice.toFixed(2)}</td>
                <td>
                  <button
                    className={`status-button ${getStatusColor(order.status)}`}
                    onClick={() => handleStatusClick(order)}
                  >
                    {order.status}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No orders available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Status Update Modal */}
      <div
        className={`fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center ${
          editingOrder ? "block" : "hidden"
        }`}
      >
        <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg">
          <button
            className="absolute top-4 right-4 text-2xl font-bold text-gray-700"
            onClick={closeModal}
          >
            &times;
          </button>
          <p className="text-2xl font-semibold mb-4">Update Order Status</p>
          <form onSubmit={handleFormSubmit}>
            <div className="flex flex-col space-y-2">
              {editingOrder ? (
                <p className="text-gray-700">Order ID: {editingOrder._id}</p>
              ) : (
                <p>Loading...</p>
              )}
              <label htmlFor="status" className="font-medium">
                Status:
              </label>
              <select
                id="status"
                value={newStatus}
                onChange={handleStatusChange}
                className="border border-gray-300 p-2 rounded-md"
              >
                <option value="pending">Pending</option>
                <option value="kyc_verified">KYC Verified</option>
                <option value="shipped">Shipped</option>
                <option value="cancelled">Cancelled</option>
                <option value="delivered">Delivered</option>
              </select>
              <button
                type="submit"
                className="mt-4 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md"
                onClick={handleFormSubmit}
              >
                Update Status
              </button>
              <button
                type="button"
                className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md"
                onClick={closeModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4 space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`px-4 py-2 rounded-md ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Orders;

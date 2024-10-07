/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery'; // Import jQuery
import '../Admin/Csss/Orders.css';
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
        console.log("API Response:", response.data);
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
    // Show the form using jQuery
    $(".status-form-overlay").show();
  };

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (!editingOrder) return;

    try {
      // Send all required fields
      await AXIOS_INSTANCE.put(`/orders/${editingOrder._id}`, {
        userId: editingOrder.user, // Assuming userId is in the order object
        products: editingOrder.products, // Assuming products are in the order object
        totalPrice: editingOrder.totalPrice, // Assuming totalPrice is in the order object
        status: newStatus.trim(), // Updated status
      });
      // Update local orders state after successful update
      setOrders(
        orders.map((order) =>
          order._id === editingOrder._id
            ? { ...order, status: newStatus }
            : order
        )
      );
      setEditingOrder(null);
      setNewStatus("");
      $(".status-form-overlay").hide();
    } catch (err) {
      console.error("Error updating order status:", err);
      setError(err);
    }
  };

  const closeModal = () => {
    setEditingOrder(null);
    setNewStatus("");
    $(".status-form-overlay").hide();
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
                <td>{order._id}</td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>₹{" "}{order.totalPrice.toFixed(2)}</td>
                <td>
                  <button
                    className={`status-button ${order.status.toLowerCase()}`}
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

      {/* Status Update Form */}
      <div className="status-form-overlay">
        <div className="status-form">
          <button className="status-form-close" onClick={closeModal}>
            &times;
          </button>
          <div>Update Order Status</div>
          <form onSubmit={handleFormSubmit}>
            <div>
              {editingOrder ? <p>{editingOrder._id}</p> : <p>Loading...</p>}
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                value={newStatus}
                onChange={handleStatusChange}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="shipped">Shipped</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <button type="submit">Update Status</button>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
          </form>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Orders;
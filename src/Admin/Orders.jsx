
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import $ from "jquery"; // Import jQuery
import "../Admin/Csss/Orders.css";
import { AXIOS_INSTANCE } from "../service";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  // const [token, setToken] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [currentPageOrders, setCurrentPageOrders] = useState(1);
  const [currentPageInvoices, setCurrentPageInvoices] = useState(1);
  const ordersPerPage = 5;
  const itemsPerPage = 50;
  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await AXIOS_INSTANCE.get("/orders");
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

    const fetchInvoices = async () => {
      try {
        
    
        if (!token) {
          throw new Error("Authentication token not found. Please log in.");
        }
    
        // API endpoint for fetching user invoices
        const apiUrl = 'invoice/user-invoices'; // Ensure the endpoint is correct
       
        // Fetch invoices using AXIOS_INSTANCE
        const response = await AXIOS_INSTANCE.get(apiUrl,{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
    
        // Check if response contains data
        if (response.data && Array.isArray(response.data.invoices)) {
          setInvoices(response.data.invoices); // Properly set invoices
        } else {
          console.error("Unexpected invoices format:", response.data);
          setInvoices([]); // Default to empty array
        }
      } catch (error) {
        console.error("Error fetching invoices:", error.message);
        setInvoices([]);
        setError(error.message || "An error occurred while fetching invoices"); // Set error for UI handling
      } finally {
        setLoading(false); // End loading state
      }
    };
    
    
    

    
    fetchOrders();
    fetchInvoices();
  }, []);

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
        orderId: editingOrder._id,
        newStatus: newStatus.trim(),
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

const handleDownloadPDF = async (invoiceId) => {
  try {
    // Retrieve the token from localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Authentication token not found. Please log in.");
    }

    // API URL for downloading the invoice
    const apiUrl = `https://truwix-rm-rental-backend-dev.vercel.app/api/invoice/${invoiceId}/download-invoice`;
  
    // Send GET request to download the file
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", // Important to handle binary data
    });

    // Create a Blob URL from the response data
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link to trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${invoiceId}.pdf`; // Default file name
    link.click();

    // Clean up the temporary Blob URL
    window.URL.revokeObjectURL(url);


  } catch (error) {
    console.error("Error downloading invoice:", error);
    toast.error("An error occurred while downloading the invoice.");
  }
};

  
  const indexOfLastOrder = currentPageOrders * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalOrderPages = Math.ceil(orders.length / ordersPerPage);

  const paginatedInvoices = invoices.slice(
    (currentPageInvoices - 1) * itemsPerPage,
    currentPageInvoices * itemsPerPage
  );
  const totalInvoicePages = Math.ceil(invoices.length / itemsPerPage);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {/* <div className="orders-container">
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
          {currentOrders.map((order) => (
            <tr key={order._id}>
              <td>{order.orderNumber}</td>
              <td>{new Date(order.orderDate).toLocaleDateString()}</td>
              <td>₹ {order.totalPrice.toFixed(2)}</td>
              <td>
                <button
                  className={`status-button px-2 ${getStatusColor(order.status)}`}
                  onClick={() => handleStatusClick(order)}
                >
                  {order.status}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      <div className="pagination">
        {Array.from({ length: totalOrderPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPageOrders(index + 1)}
            className={`page-button ${
              currentPageOrders === index + 1 ? "active" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>

      <h1>Invoices</h1>

      <table className="invoices-table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>User ID</th>
            <th>Amount</th>
            <th>Payment ID</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {paginatedInvoices.map((invoice, index) => (
            <tr key={index}>
              <td>{invoice._id}</td>
              <td>{invoice.userId}</td>
              <td>₹{invoice.amount.toFixed(2)}</td>
              <td>{invoice.paymentId}</td>
              <td>{new Date(invoice.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalInvoicePages }, (_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPageInvoices(index + 1)}
            className={`page-button ${
              currentPageInvoices === index + 1 ? "active" : ""
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div> */}

    <div className="orders-container p-5">
  <h1 className="text-2xl font-bold mb-5">Orders</h1>

  <div className="overflow-x-auto shadow-md sm:rounded-lg">
    <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 border">
      <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3">Order ID</th>
          <th scope="col" className="px-6 py-3">Order Date</th>
          <th scope="col" className="px-6 py-3">Total Price</th>
          <th scope="col" className="px-6 py-3">Status</th>
        </tr>
      </thead>
     
      <tbody>
        {currentOrders.map((order) => (
          <tr
            key={order._id}
            className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600"
          >
            <td className="px-6 py-4">{order.orderNumber}</td>
            <td className="px-6 py-4">{new Date(order.orderDate).toLocaleDateString()}</td>
            <td className="px-6 py-4">₹ {order.totalPrice.toFixed(2)}</td>
            <td className="px-6 py-4">
              <button
                className={`px-3 py-1 text-white rounded-full ${getStatusColor(order.status)}`}
                onClick={() => handleStatusClick(order)}
              >
                {order.status}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div className="flex justify-center mt-5">
    {Array.from({ length: totalOrderPages }, (_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPageOrders(index + 1)}
        className={`px-4 py-2 mx-1 border rounded ${
          currentPageOrders === index + 1
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {index + 1}
      </button>
    ))}
  </div>

  <h1 className="text-2xl font-bold mt-10 mb-5">Invoices</h1>

  <div className="overflow-x-auto shadow-md sm:rounded-lg">
  <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400 border">
    <thead className="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-6 py-3">Invoice ID</th>
        <th scope="col" className="px-6 py-3">User ID</th>
        <th scope="col" className="px-6 py-3">Amount</th>
        <th scope="col" className="px-6 py-3">Payment ID</th>
        <th scope="col" className="px-6 py-3">Status</th>
        <th scope="col" className="px-6 py-3">Item Count</th>
        <th scope="col" className="px-6 py-3">Created At</th>
        <th scope="col" className="px-6 py-3">Actions</th>
      </tr>
    </thead>
    <tbody>
      {paginatedInvoices.map((invoice, index) => (
        <tr
          key={index}
          className="bg-white border-b hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-600"
        >
          <td className="px-6 py-4">{invoice._id || "N/A"}</td>
          <td className="px-6 py-4">{invoice.userId || "N/A"}</td>
          <td className="px-6 py-4">₹{invoice.amount ? invoice.amount.toFixed(2) : "0.00"}</td>
          <td className="px-6 py-4">{invoice.paymentId || "N/A"}</td>
          <td className="px-6 py-4">{invoice.status || "N/A"}</td>
          <td className="px-6 py-4">{invoice.items ? invoice.items.length : 0}</td>
          <td className="px-6 py-4">
            {invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "N/A"}
          </td>
          <td className="px-6 py-4">
          <button
  onClick={() => handleDownloadPDF(invoice._id)}
  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-600"
>
  Download PDF
</button>


          </td>
        </tr>
      ))}
    </tbody>
  </table>
  </div>


  <div className="flex justify-center mt-5">
    {Array.from({ length: totalInvoicePages }, (_, index) => (
      <button
        key={index}
        onClick={() => setCurrentPageInvoices(index + 1)}
        className={`px-4 py-2 mx-1 border rounded ${
          currentPageInvoices === index + 1
            ? "bg-blue-500 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        {index + 1}
      </button>
    ))}
  </div>
</div>
    </div>

  );
};

export default Orders;


import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../assets/csss/SuccessPage.css';
import { AXIOS_INSTANCE } from "../../service";

const Success = () => {
  const [order, setOrder] = useState(null);
  const { id } = useParams(); 
 
  

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await AXIOS_INSTANCE.get(`/orders/${id}`);
        setOrder(response.data.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrder();
  }, [id]);

  return (
    <div className="success-page">
      <h1>Payment Successful!</h1>
      <p>Thank you for your purchase. Your transaction was successful.</p>
      <p>Your order is being processed and you will receive a confirmation email soon.</p>

      <div className="order-details">
        <h2 className='overflow-hidden'>Your Order Details:</h2>
        {order ? (
          <div>
            <p>Order ID: {order._id}</p>
            <p>Total Price: ₹{order.totalPrice}</p>
            <p>Order Date: {new Date(order.orderDate).toLocaleDateString()}</p>
            <p>Products:</p>
            <ul>
              {order.products.map((product, index) => (
                <li key={index}>
                  <p>Product ID: {product.product}</p>
                  <p>Quantity: {product.quantity}</p>
                  <p>Subscription Months: {product.subscriptionMonths}</p>
                  {product.expirationDate && (
                    <p>Expiration Date: {new Date(product.expirationDate).toLocaleDateString()}</p>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Loading order details...</p>
        )}
      </div>

      <Link to="/">Return to Home</Link>
    </div>
  );
};

export default Success;

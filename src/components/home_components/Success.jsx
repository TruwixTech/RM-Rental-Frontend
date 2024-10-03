// import React, { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import axios from 'axios';
// import '../../assets/csss/SuccessPage.css'; // Import your CSS file for styling

// const Success = () => {
//   const [orders, setOrders] = useState([]);
//   const { id } = useParams();
//   console.log(id);
  

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const response = await axios.get(`http://localhost:4000/api/orders/${id}`); // Adjust the URL if needed
//         console.log(response.data);
  
//         const data = response.data;
  
//         if (Array.isArray(data)) {
//           setOrders(data); // If it's already an array
//         } else if (data && Array.isArray(data.orders)) {
//           setOrders(data.orders); // If the orders are inside an object
//         } else {
//           console.error("Unexpected response structure:", data);
//           setOrders([]); // Set to an empty array if structure is unexpected
//         }
  
//       } catch (error) {
//         console.error("Error fetching orders:", error);
//       }
//     };
  
//     fetchOrders();
//   }, []);
  
  

//   return (
//     <div className="success-page">
//       <h1>Payment Successful!</h1>
//       <p>Thank you for your purchase. Your transaction was successful.</p>
//       <p>Your order is being processed and you will receive a confirmation email soon.</p>

//       <div className="orders-list">
//         <h2>Your Orders:</h2>
//         {orders.length === 0 ? (
//           <p>No orders found.</p>
//         ) : (
//           <ul>
//             {orders.map((order) => (
//               <li key={order._id}>
//                 <p>Order ID: {order._id}</p>
//                 <p>Products:</p>
//                 <ul>
//                   {order.products.map((product, index) => (
//                     <li key={index}>
//                       <p>Product ID: {product.product}</p>
//                       <p>Quantity: {product.quantity}</p>
//                       <p>Subscription Months: {product.subscriptionMonths}</p>
//                     </li>
//                   ))}
//                 </ul>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <Link to="/">Return to Home</Link>
//     </div>
//   );
// };

// export default Success;



import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import '../../assets/csss/SuccessPage.css';
import { AXIOS_INSTANCE } from "../../service";

const Success = () => {
  const [order, setOrder] = useState(null);
  const { id } = useParams(); 
  console.log(id);
  

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

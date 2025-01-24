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



// import React, { useEffect, useState } from 'react';
// import { Link, useParams } from 'react-router-dom';
// import axios from 'axios';
// import { AXIOS_INSTANCE } from "../../service";

// const Success = () => {
//   const [order, setOrder] = useState(null);
//   const [userList, setUserList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const { id } = useParams(); 
  
//   // Fetch order details
//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const response = await AXIOS_INSTANCE.get(`/orders/${id}`);
//         setOrder(response.data.data);
//       } catch (error) {
//         console.error("Error fetching order:", error);
//       }
//     };

//     fetchOrder();
//   }, [id]);

//   // Fetch user list after payment successful
//   const fetchUserList = async () => {
//     setLoading(true);
//     try {
//       const response = await AXIOS_INSTANCE.get('/users');  // Adjust endpoint if needed
//       setUserList(response.data);  // Assuming response contains an array of users
//     } catch (error) {
//       console.error("Error fetching user list:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle PDF download for individual user
//   const downloadPDF = async (userId) => {
//     try {
//       const response = await AXIOS_INSTANCE.get(`/download-pdf/${userId}`, {
//         responseType: 'blob',
//       });
//       const file = new Blob([response.data], { type: 'application/pdf' });
//       const fileURL = URL.createObjectURL(file);
//       const link = document.createElement('a');
//       link.href = fileURL;
//       link.download = `user_${userId}.pdf`;
//       link.click();
//     } catch (error) {
//       console.error("Error downloading PDF:", error);
//     }
//   };

//   return (
//     <div className="success-page p-6 bg-white shadow-lg rounded-lg">
//       <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
//       <p className="text-lg mb-4">Thank you for your purchase. Your transaction was successful.</p>
//       <p className="text-lg mb-6">Your order is being processed, and you will receive a confirmation email soon.</p>

//       <div className="order-details mb-6">
//         <h2 className="text-2xl font-semibold">Your Order Details:</h2>
//         {order ? (
//           <div>
//             <p><strong>Order ID:</strong> {order._id}</p>
//             <p><strong>Total Price:</strong> ₹{order.totalPrice}</p>
//             <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
//             <p><strong>Products:</strong></p>
//             <ul>
//               {order.products.map((product, index) => (
//                 <li key={index} className="mb-3">
//                   <p><strong>Product ID:</strong> {product.product}</p>
//                   <p><strong>Quantity:</strong> {product.quantity}</p>
//                   <p><strong>Subscription Months:</strong> {product.subscriptionMonths}</p>
//                   {product.expirationDate && (
//                     <p><strong>Expiration Date:</strong> {new Date(product.expirationDate).toLocaleDateString()}</p>
//                   )}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         ) : (
//           <p>Loading order details...</p>
//         )}
//       </div>

//       <button 
//         className="bg-blue-500 text-white py-2 px-4 rounded-md mb-6"
//         onClick={fetchUserList}
//       >
//         Fetch User List
//       </button>

//       {loading ? (
//         <p>Loading user list...</p>
//       ) : (
//         userList.length > 0 && (
//           <div>
//             <h3 className="text-xl font-semibold mb-4">User List:</h3>
//             <table className="min-w-full table-auto border-collapse border border-gray-300">
//               <thead>
//                 <tr>
//                   <th className="px-4 py-2 border-b">User ID</th>
//                   <th className="px-4 py-2 border-b">Name</th>
//                   <th className="px-4 py-2 border-b">Email</th>
//                   <th className="px-4 py-2 border-b">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {userList.map((user) => (
//                   <tr key={user.id}>
//                     <td className="px-4 py-2 border-b">{user.id}</td>
//                     <td className="px-4 py-2 border-b">{user.name}</td>
//                     <td className="px-4 py-2 border-b">{user.email}</td>
//                     <td className="px-4 py-2 border-b">
//                       <button 
//                         className="bg-green-500 text-white py-1 px-3 rounded"
//                         onClick={() => downloadPDF(user.id)}
//                       >
//                         Download PDF
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )
//       )}

//       <Link to="/" className="text-blue-500 mt-6 inline-block">Return to Home</Link>
//     </div>
//   );
// };

// export default Success;


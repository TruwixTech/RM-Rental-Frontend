import React from 'react';
import { useLocation } from 'react-router-dom';
import '../assets/csss/Orderdetails.css';

const Orderdetails = () => {
  const location = useLocation();
  const { cartData, orderId } = location.state || {};

  const totalPrice = cartData
    ? cartData.reduce((acc, item) => acc + item.productPrice * item.quantity, 0)
    : 0;

  return (
  <div className='order-container'>
    <div className="order-details-container">
      <h1 style={{color: '#FFD74D', fontWeight: 700}}>Thank You for Your Purchase!</h1>
      <div>Order ID: {orderId}</h2>
      <div className="order-details">
        {cartData && cartData.length > 0 ? (
          cartData.map((item) => (
            <div key={item.id} className="order-item">
              <img src={item.productImage} alt={item.productName} />
              <div>
                <h3>{item.productName}</h3>
                <p>Price: ₹{item.productPrice}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Total: ₹{item.productPrice * item.quantity}</p>
                <p>Selected Month: {item.selectedMonth}</p>
                <p>Selected Seat: {item.selectedSeat}</p>
                <p>Selected Configuration: {item.selectedConfig}</p>
                <p>Selected Color: {item.selectedColor}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No items found in the cart.</p>
        )}
      </div>
      {cartData && cartData.length > 0 && (
        <div className="total-price">Total: ₹{totalPrice}</div>
      )}
    </div>
    </div>
  );
};

export default Orderdetails;

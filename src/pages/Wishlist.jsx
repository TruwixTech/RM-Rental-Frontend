import '../assets/csss/Wishlist.css'
import React from "react";
import { FaDeleteLeft } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../features/wishlistSlice";
// import { Link } from "react-router-dom";

const placeholderImageURL = "https://img.freepik.com/free-vector/hand-drawn-people-supermarket-background_23-2148131593.jpg?w=740&t=st=1711799669~exp=1711800269~hmac=4b141e4abb7d58d2d81dde1fa92b4d864e38d22ebf439ea48189286e99e8dedf"; // Replace this with your placeholder image URL

const Wishlist = () => {
  const wishlistData = useSelector((state) => state.wishlist.wishlist); // Adjusted to use 'wishlist' directly from state
  const dispatch = useDispatch();

  const productRemoveFromWishlist = (id) => {
    dispatch(removeFromWishlist({ id }));
  };

  return (
    <>
      <div className="wishlist-heading">
        <h1 className='font-semibold text-2xl'>Wishlist</h1>
      </div>
      <hr />
      <br />
      <div className="wishlist-items-container">
        {wishlistData.length === 0 ? (
          <div className="empty-wishlist-image-container">
            <h1 className='text-2xl text-gray-400 font-medium'>Your Wishlist is empty</h1>
            <img src={placeholderImageURL} alt="Empty Wishlist" />
          </div>
        ) : (
          <div className="wishlist-items-list">
            {wishlistData.map((item) => (
              <div key={item.id} className="wishlist-card">
                <div className="wishlist-image">
                  <img src={item.productImage || placeholderImageURL} alt={item.productName} />
                </div>
                <div className="wishlist-details">
                  <div className="wishlist-text">
                    <div>{item.productName}</h2>
                    <h3>{item.productTitle}</h3>
                    <p>Price: ₹{item.productPrice}</p>
                  </div>
                  <div className="wishlist-actions">
                    <button
                      className="delete-button"
                      onClick={() => productRemoveFromWishlist(item.id)}
                    >
                      <FaDeleteLeft />
                      Remove
                    </button>
                    {/* <Link to={`/productdetail/${item.id}`}>
                      <button className="buy-now-wishlist">Buy now</button>
                    </Link> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;

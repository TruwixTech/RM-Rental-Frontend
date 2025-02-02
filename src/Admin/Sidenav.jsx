/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import './Csss/Sidenav.css'
import { IoIosLogOut } from "react-icons/io";
const SideNavbar = () => {
    const [isOpen, setIsOpen] = useState(false);


    const toggleNav = () => setIsOpen(!isOpen);
    const closeNav = () => setIsOpen(false);

    return (
        <>
            <div className={`side-navbar ${isOpen ? 'open' : ''}`}>
                <button className="close-btn -mt-3" onClick={toggleNav}>×</button>
                <nav className='mt-4'>
                    <Link to="/admindashboard" onClick={closeNav}>Statistics</Link>
                    {/* <Link to="allproduct" onClick={closeNav}>Booking</Link> */}
                    <Link to="kyc-records" onClick={closeNav}>Manage KYCs</Link>
                    <Link to="addproduct" onClick={closeNav}>Add Product</Link>
                    <Link to="allproduct" onClick={closeNav}>All Products</Link>
                    {/* <Link to="approve" onClick={closeNav}>Approve</Link> */}
                    <Link to="orders"  onClick={closeNav}>Orders</Link>
                    {/* <Link to="blog"  onClick={closeNav}>Blog</Link> */}
                    
                    {/* <Link><IoIosLogOut className="logout-icon" onClick={logout} /></Link> */}
                    {/* <button onClick={logout} className="logout-btn">Logout</button>  */}
                    {/* <Link to="coupon" onClick={closeNav}>Coupon</Link>
                    <Link to="categorie" onClick={closeNav}>Categorie</Link>
                    <Link to="brands" onClick={closeNav}>Brands</Link>
                    <Link to="orderdetails" onClick={closeNav}>OrderDetails</Link> */}
                </nav>
            </div>
            <button className="open-btn absolute md:top-28 text-2xl top-28 ml-0 bg-yellow-400 p-2" onClick={toggleNav}>☰</button>
        </>
    );
};

export default SideNavbar;
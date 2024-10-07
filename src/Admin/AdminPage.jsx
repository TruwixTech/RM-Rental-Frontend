/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { FaBox, FaUsers, FaClipboardList } from 'react-icons/fa';
import './Csss/AdminPage.css';
import axios from 'axios';
import { AXIOS_INSTANCE } from "../service";

const AdminPage = () => {
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  useEffect(() => {
    const fetchProductCount = async () => {
      try {
        const response = await AXIOS_INSTANCE.get("/products/count");
        setProductCount(response.data.count);
      } catch (error) {
        console.error('Error fetching product count:', error);
      }
    };
    const fetchUserCount = async () => {
      try {
        const response = await AXIOS_INSTANCE.get("/counter");
        setUserCount(response.data.count);
      } catch (error) {
        console.error('Error fetching user count:', error);
      }
    };

    fetchUserCount();
    fetchProductCount();
  }, []);

  return (
    <div className="admin-page">
      <div className="section">
        <div className="icon">
          <FaBox />
        </div>
        <div className="text">
          <div>Products in Stock</div>
          <p className="value">300</p>
        </div>
      </div>

      <div className="section">
        <div className="icon">
          <FaClipboardList />
        </div>
        <div className="text">
          <div>Total Products</div>
          <p className="value">{productCount}</p>
        </div>
      </div>

      <div className="section">
        <div className="icon">
          <FaUsers />
        </div>
        <div className="text">
          <div>Total Users</div>
          <p className="value">{userCount}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
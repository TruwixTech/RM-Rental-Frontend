/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Outlet, Routes, Route } from "react-router-dom"; // Added Routes and Route for routing
import "../Admin/Csss/AdminLayout.css"; // Import the CSS file
import SideNavbar from "../Admin/Sidenav";
import { AXIOS_INSTANCE } from "../service";
import storageService from "../service/storage.service";
import AddProduct from "./AddProduct"; // Ensure the AddProduct component is imported
import Subscription from "../Admin/Subscription"; 

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [role, setRole] = useState(storageService.get("user")?.role || ""); // Role-based access control
  const token = localStorage.getItem("token"); // Use token from localStorage

  // Check if the user has admin access
  useEffect(() => {
    if (!token || role !== "Admin") {
      setError("Access denied. You do not have permission to view this page.");
    }
  }, [role, token]);
  if (loading) return <div>Loading...</div>;
  if (error)
    return (
      <div>
        <h2>{error}</h2>
      </div>
    );

  return (
    <div className="admin-layout">
      <SideNavbar className="sidenav" />
      <div className="content">
        <Outlet/>
        <Subscription />
      </div>
    </div>
  );
};

export default AdminDashboard;

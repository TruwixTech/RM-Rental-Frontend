/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Outlet } from "react-router-dom";
import "../Admin/Csss/AdminLayout.css"; // Import the CSS file
import SideNavbar from "../Admin/Sidenav";
import { AXIOS_INSTANCE } from "../service";
import storageService from "../service/storage.service";
import Subscription from "../Admin/Subscription";

const AdminDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(storageService.get("user")?.role);
  const [formData, setFormData] = useState({
    title: "",
    sub_title: "",
    price: "",
    category: "",
    img: [],
  });
  const [submitError, setSubmitError] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "img") {
      setFormData({
        ...formData,
        img: files,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "img") {
        for (let i = 0; i < formData.img.length; i++) {
          data.append("img", formData.img[i]);
        }
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await AXIOS_INSTANCE.post("/products", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      setFormData({
        title: "",
        sub_title: "",
        price: "",
        category: "",
        img: [],
      });
    } catch (err) {
      console.error("Error creating product:", err);
      setSubmitError(err.response?.data?.error || "An error occurred");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (role !== "Admin")
    return (
      <div>Access has been denied. You do not have permission to view this page.</div>
    );

  return (
    <>
      <div className="admin-layout">
        <SideNavbar className="sidenav" />
        <div className="content">
          <Outlet />
          <Subscription/>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;

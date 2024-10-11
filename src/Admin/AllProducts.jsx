/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import './Csss/AllProducts.css';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
// import { useSelector } from 'react-redux'; // Assuming you're using Redux for auth
import { AXIOS_INSTANCE } from "../service";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5; // Products per page
  // const token = useSelector((state) => state.auth.token);

  // Fetch products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await AXIOS_INSTANCE.get("/products");
        setProducts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const openEditForm = (product) => {
    setSelectedProduct(product);
    $("#editForm").fadeIn();
    $(".overlay").fadeIn();
  };

  const closeEditForm = () => {
    $("#editForm").fadeOut();
    $(".overlay").fadeOut();
  };

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    $("#deleteModal").fadeIn();
    $(".overlay").fadeIn();
  };

  const closeDeleteModal = () => {
    $("#deleteModal").fadeOut();
    $(".overlay").fadeOut();
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const updatedProduct = {
      title: event.target.title.value,
      sub_title: event.target.sub_title.value,
      price: event.target.price.value,
      category: event.target.category.value,
    };

    try {
      const response = await AXIOS_INSTANCE.put(`/products/${selectedProduct._id}`, updatedProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(
        products.map((product) => 
          product._id === selectedProduct._id ? response.data.data : product
        )
      );
      closeEditForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    try {
      await AXIOS_INSTANCE.delete(`/products/${selectedProduct._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(
        products.filter((product) => product._id !== selectedProduct._id)
      );
      closeDeleteModal();
    } catch (err) {
      setError(err.message);
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <div className="header-container">
        <h1 className="products-title">ALL Products</h1>
      </div>

      <div className="table-container">
        <table className="products-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Subtitle</th>
              <th>Price</th>
              <th>Category</th>
              <th>Image</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product._id}>
                <td>{product.title}</td>
                <td>{product.sub_title}</td>
                <td>${typeof product.price === 'number' ? product.price.toFixed(2) : "N/A"}</td>
                <td>{product.category}</td>
                <td>
                  {product.img.length > 0 && (
                    <img
                      src={product.img[0]}
                      alt={product.title}
                      className="product-image"
                    />
                  )}
                </td>
                <td className="edit-button">
                  <FaEdit onClick={() => openEditForm(product)} />
                </td>
                <td className="">
                  <MdDelete onClick={() => openDeleteModal(product)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        {[...Array(totalPages).keys()].map((number) => (
          <button
            key={number + 1}
            className={currentPage === number + 1 ? "active" : ""}
            onClick={() => paginate(number + 1)}
          >
            {number + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Edit Product Form */}
      <div id="editForm" className="modal-form">
        <form onSubmit={handleEditSubmit}>
          <div className="form-header">Edit Product</div>
          <label>Title</label>
          <input
            type="text"
            name="title"
            defaultValue={selectedProduct?.title}
            required
          />
          <label>Sub Title</label>
          <input
            type="text"
            name="sub_title"
            defaultValue={selectedProduct?.sub_title}
          />
          <label>Price</label>
          <input
            type="number"
            name="price"
            defaultValue={selectedProduct?.price}
            required
          />
          <label>Category</label>
          <input
            type="text"
            name="category"
            defaultValue={selectedProduct?.category}
            required
          />
          <button type="submit">Save Changes</button>
          <button type="button" className="close-btn" onClick={closeEditForm}>
            Cancel
          </button>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      <div id="deleteModal" className="modal-confirm">
        <div className="modal-header">
          Are you sure you want to delete this product?
        </div>
        <button className="confirm-btn" onClick={handleDelete}>
          Yes, Delete
        </button>
        <button className="cancel-btn" onClick={closeDeleteModal}>
          Cancel
        </button>
      </div>

      {/* Overlay */}
      <div
        className="overlay"
        onClick={() => {
          closeEditForm();
          closeDeleteModal();
        }}
      ></div>
    </div>
  );
};

export default AllProducts;

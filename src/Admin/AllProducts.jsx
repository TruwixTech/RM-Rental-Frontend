/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import $ from 'jquery';
import './Csss/AllProducts.css';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { useSelector } from 'react-redux'; // Assuming you're using Redux for auth
import { AXIOS_INSTANCE } from "../service";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5); // Set the number of products per page
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    AXIOS_INSTANCE.get("/products")
      .then((response) => {
        setProducts(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
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

  const handleEditSubmit = (event) => {
    event.preventDefault();
    const updatedProduct = {
      title: event.target.title.value,
      sub_title: event.target.sub_title.value,
      price: event.target.price.value,
      category: event.target.category.value,
    };

    AXIOS_INSTANCE.put(`/products/${selectedProduct._id}`, updatedProduct, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setProducts(
          products.map((product) =>
            product._id === selectedProduct._id ? response.data.data : product
          )
        );
        closeEditForm();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleDelete = () => {
    AXIOS_INSTANCE.delete(`/products/${selectedProduct._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setProducts(
          products.filter((product) => product._id !== selectedProduct._id)
        );
        closeDeleteModal();
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

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
                <td>${product.price.toFixed(2)}</td>
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
      <div id="editForm">
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
      <div id="deleteModal">
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
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import axios from "axios";
import $ from "jquery";
import "./Csss/AllProducts.css";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
// import { useSelector } from 'react-redux'; // Assuming you're using Redux for auth
import { AXIOS_INSTANCE } from "../service";
import toast from "react-hot-toast";

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5); // Set the number of products per page
  // const token = useSelector((state) => state.auth.token);
  const [newSize, setNewSize] = useState("");
  const [rentalOptions, setRentalOptions] = useState({});
  const [newMonth, setNewMonth] = useState("");
  const [newRentPrice, setNewRentPrice] = useState("");

  const [currentImages, setCurrentImages] = useState([]); // Existing images
  const [newImages, setNewImages] = useState([]); // New images to be added
  const [months, setMonths] = useState([]); // Existing months in product details

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

  const openEditForm = (product, img) => {
    setRentalOptions(product?.rentalOptions || {});
    setNewSize(product?.size || "");
    setCurrentImages(img || []);
    setSelectedProduct(product);
    setMonths(product?.details?.month || []);
    $("#editForm").fadeIn();
    $(".overlay").fadeIn();
  };

  const closeEditForm = () => {
    $("#editForm").fadeOut();
    $(".overlay").fadeOut();
    setRentalOptions({});
    setNewSize("");
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

  // Handle image removal
  const removeImage = (imageUrl) => {
    setCurrentImages(currentImages.filter((img) => img !== imageUrl));
  };

  // Handle new image file input
  // Handle new image file input
  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    setNewImages([...newImages, ...files]); // Store the File objects instead of URLs
  };

  // Handle months change
  const handleMonthsChange = (event) => {
    const value = parseInt(event.target.value);
    if (event.target.checked) {
      setMonths([...months, value]);
    } else {
      setMonths(months.filter((month) => month !== value));
    }
  };

  const addMonthAndRent = () => {
    const month = parseInt(newMonth, 10);

    if (month && newRentPrice) {
      setMonths([...months, month]);
      setRentalOptions((prevRentalOptions) => ({
        ...prevRentalOptions,
        [month]: newRentPrice,
      }));
      setNewMonth("");
      setNewRentPrice("");
      toast.success("Month and Rent added successfully!");
    } else {
      toast.error("Please enter valid month and rent price!");
    }
  };

  // Handle form submission
  const handleEditSubmit = (event) => {
    event.preventDefault();
    setLoading(true); // Start loading and disable button

    // Create a FormData object
    const formData = new FormData();

    // Append text fields
    formData.append("title", event.target.title.value);
    formData.append("sub_title", event.target.sub_title.value);
    formData.append("category", event.target.category.value);
    formData.append("description", event.target.description.value);
    formData.append("size", newSize);
    formData.append("rentalOptions", JSON.stringify(rentalOptions));

    // Append current images (URLs)
    currentImages.forEach((image) => {
      if (typeof image === "string" && !image.startsWith("blob:")) {
        formData.append("img", image);
      }
    });

    // Append new images as file objects
    newImages.forEach((file) => {
      formData.append("newImages", file);
    });

    // Append details object
    formData.append(
      "details",
      JSON.stringify({
        description: event.target.description.value,
        month: months,
      })
    );

    // API call to update product
    AXIOS_INSTANCE.put(`/products/${selectedProduct._id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        // Update the product list
        setProducts(
          products.map((product) =>
            product._id === selectedProduct._id ? response.data.data : product
          )
        );
        toast.success("Product Updated Successfully");

        // Reset the form and state after successful update
        setSelectedProduct(null);
        setCurrentImages([]);
        setNewImages([]);
        setMonths([]);

        // Only close the form after the product has been updated successfully
        closeEditForm();
      })
      .catch((error) => {
        setError(error.message);
        toast.error("Failed to update product.");
      })
      .finally(() => {
        // Re-enable the button and reset text after the operation is done
        setLoading(false);
      });
  };

  const handleDelete = () => {
    AXIOS_INSTANCE.delete(`/products/${selectedProduct._id}`)
      .then(() => {
        setProducts(
          products.filter((product) => product._id !== selectedProduct._id)
        );
        toast.success("Product Deleted Successfully");
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

  function removeMonthAndRent(month) {
    setMonths(months.filter((m) => m !== month));
    setRentalOptions((prevRentalOptions) => {
      const updatedRentalOptions = { ...prevRentalOptions };
      delete updatedRentalOptions[month];
      return updatedRentalOptions;
    });
  }

  return (
    <div>
      <div className="header-container">
        <h1 className="products-title">ALL Products</h1>
      </div>
      <div className="table-container overflow-x-auto">
        <table className="products-table table-responsive min-w-full block md:table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Subtitle</th>
              <th>Size</th>
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
                <td>{product.size}</td>
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
                  <FaEdit onClick={() => openEditForm(product, product.img)} />
                </td>
                <td className="cursor-pointer">
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
          <br />
          <div className="md:flex md:gap-4">
            <div className="md:w-[50%]">
              {/* Title */}
              <label>Title</label>
              <input
                type="text"
                name="title"
                defaultValue={selectedProduct?.title}
                required
              />

              {/* Sub Title */}
              <label>Sub Title</label>
              <input
                type="text"
                name="sub_title"
                defaultValue={selectedProduct?.sub_title}
                required
              />

              {/* Description */}
              <label>Description</label>
              <input
                type="text"
                name="description"
                defaultValue={selectedProduct?.details?.description}
                required
              />

              {/* Category */}
              <label>Category</label>
              <select name="category" required>
                <option value="">Select Category</option>
                <option
                  value="appliance"
                  selected={selectedProduct?.category === "appliance"}
                >
                  Appliance
                </option>
                <option
                  value="livingroom"
                  selected={selectedProduct?.category === "livingroom"}
                >
                  Living Room
                </option>
                {/* <option
                  value="kitchen"
                  selected={selectedProduct?.category === "kitchen"}
                >
                  Kitchen
                </option> */}
                <option
                  value="storage"
                  selected={selectedProduct?.category === "storage"}
                >
                  Storage
                </option>
                <option
                  value="studyroom"
                  selected={selectedProduct?.category === "studyroom"}
                >
                  Study Room
                </option>
                <option
                  value="bedroom"
                  selected={selectedProduct?.category === "bedroom"}
                >
                  Bed Room
                </option>
                {/* <option
                  value="chair"
                  selected={selectedProduct?.category === "chair"}
                >
                  Chair
                </option> */}
                <option
                  value="table"
                  selected={selectedProduct?.category === "table"}
                >
                  Table
                </option>
              </select>
              <br />
              <br />

              {/* Display Current Images */}
              <label>Current Images</label>
              <div className="">
                {currentImages.map((img, index) => (
                  <div key={index} className="image-item flex gap-2 flex-col overflow-hidden">
                    <a
                      href={img}
                      alt="product image"
                      className="image-preview"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {img}
                    </a>
                    <button
                      type="button"
                      onClick={() => removeImage(img)}
                      className="flex justify-center delete-img-btn"
                    >
                      <MdDelete />
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload New Images */}
              <label>New Images</label>
              <input
                type="file"
                name="newImages"
                accept="image/*"
                onChange={handleImageUpload}
                multiple
              />
              <div className="flex-col w-full gap-2 flex">
                <label>Size</label>
                <select
                  name="size"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  className="p-3 border rounded-lg"
                  required
                >
                  <option value="">Select Size</option>
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              {/* <div className="image-preview-container">
                {img.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt="new product"
                    className="image-preview"
                  />
                ))}
              </div> */}
            </div>
            <div className="md:w-[50%]">
              <div className="flex space-x-2 flex-col">
                <label>Select Months:</label>
                <br />
                <div className="flex gap-3 flex-col">
                  <input
                    type="number"
                    value={newMonth}
                    placeholder="Add a month"
                    onChange={(e) => setNewMonth(e.target.value)}
                    className="form-input"
                  />
                  <input
                    type="text"
                    value={newRentPrice}
                    placeholder="Add rent price"
                    onChange={(e) => setNewRentPrice(e.target.value)}
                    className="form-input"
                  />
                </div>
                <button
                  type="button"
                  onClick={addMonthAndRent}
                  className="submit-button text-white bg-[#FFD74D]"
                >
                  Add Month & Rent
                </button>
                <br />
                <div className="">
                  {
                    selectedProduct && (
                      Object.entries(rentalOptions).map(
                        ([month, rentPrice], index) => (
                          <div key={index} className="flex justify-between items-center gap-4 my-2">
                            <label className="w-[50%]">
                              {month} months - ₹{rentPrice}
                            </label>
                            <span
                              onClick={() => removeMonthAndRent(month)}
                              className=" bg-red-500 cursor-pointer w-[40%] text-white flex justify-center rounded-md items-center font-semibold py-2"
                            >
                              Remove
                            </span>
                          </div>
                        )
                      )
                    )
                  }
                </div>
              </div>
            </div>
          </div>

          <br />
          <div className="flex gap-2 mt-4">
            <button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button type="button" className="close-btn" onClick={closeEditForm}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      <div className="overlay" onClick={closeEditForm}></div>

      {/* Delete Modal */}
      <div id="deleteModal">
        <h2 className="pb-4 text-xl">Delete Product</h2>
        <p className="pb-4">Action can not be undone!</p>
        <button type="submit" onClick={handleDelete} className="confirm-btn">
          Yes
        </button>
        <button onClick={closeDeleteModal} className="cancel-btn">
          No
        </button>
      </div>
    </div>
  );
};

export default AllProducts;

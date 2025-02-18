/* eslint-disable no-unused-vars */
import React, { useRef, useState } from "react";
import "./Csss/AddProduct.css";
import toast from "react-hot-toast";
import { AXIOS_INSTANCE } from "../service";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    title: "",
    sub_title: "",
    category: "",
    img: [],
    size: "",
    discount: 0,
    height: '',
    width: '',
    weight: '',
    hsncode: '',
    description: "",
    month: [], // Will store months only
    rentalOptions: {}, // Store month-rent mapping here
    quantity: null, // Include quantity in formData
    hsnbarcode: null,
  });
  const [newMonth, setNewMonth] = useState("");
  const [newRentPrice, setNewRentPrice] = useState("");
  const [submitError, setSubmitError] = useState(null);
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "img") {
      setFormData({
        ...formData,
        img: files,
      });
    }
    else if (name === "hsnbarcode") {
      setFormData((prev) => ({
        ...prev,
        hsnbarcode: files[0], // Store single file
      }))
    }
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const addMonthAndRent = () => {
    const month = parseInt(newMonth, 10);

    if (month && !formData.month.includes(month) && newRentPrice) {

      const updatedMonths = [...formData.month, month];

      const newRentalOption = { [month]: newRentPrice };

      setFormData((prevData) => ({
        ...prevData,
        month: updatedMonths,
        rentalOptions: { ...prevData.rentalOptions, ...newRentalOption }, // Update the rentalOptions object
      }));

      setNewMonth("");
      setNewRentPrice("");
      toast.success("Month and Rent added successfully!");
    } else {
      toast.error("Please enter valid month and rent price!");
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);



    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "img") {
        for (let i = 0; i < formData.img.length; i++) {
          data.append("img", formData.img[i]);
        }
      } else if (key === "month") {
        formData[key].forEach((month) => {
          data.append("month[]", month);
        });
      } else if (key === "rentalOptions") {
        Object.entries(formData.rentalOptions).forEach(([month, rent]) => {
          data.append(`rentalOptions[${month}]`, rent);
        });
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await AXIOS_INSTANCE.post("/products/add-product-v2", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      // Reset form data and other states
      setFormData({
        title: "",
        sub_title: "",
        category: "",
        img: [],
        description: "",
        month: [],
        rentalOptions: {},
        quantity: null,
        discount: 0,
        height: "",
        width: "",
        weight: "",
        hsncode: "",
        size: "",
        hsnbarcode: null,
      });

      setNewMonth("");
      setNewRentPrice("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error("Something went wrong! Try again later!");
      setSubmitError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="add-product">
      <h2 className="mb-10 text-center font-semibold text-2xl">Add Product</h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="flex gap-8">
          <div>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                placeholder="Title"
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Sub Title</label>
              <input
                type="text"
                name="sub_title"
                value={formData.sub_title}
                placeholder="Subtitle"
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="p-3"
                required
              >
                <option value="">Select Category</option>
                <option value="appliance">Appliance</option>
                <option value="livingroom">Living Room</option>
                <option value="storage">Storage</option>
                <option value="studyroom">Study Room</option>
                <option value="bedroom">Bed Room</option>
                {/* <option value="table">Table</option> */}
                <option value="package">Package</option>
                <option value="dinningroom">Dinning Room</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                onChange={handleChange}
                value={formData.description}
                name="description"
                required
                className="form-input"
              />
            </div>
            <div className="flex-col w-full gap-2 flex">
              <label>Size</label>
              <select
                name="size"
                value={formData.size || ""}
                onChange={handleChange}
                className="p-3 border rounded-lg"
                required
              >
                <option value="">Select Size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="flex-col w-full gap-2 flex mt-2">
              <label>Discount</label>
              <input type="number" name="discount" value={formData.discount} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-group mt-2">
              <label>Height</label>
              <input
                type="text"
                name="height"
                value={formData.height || ""}
                placeholder="Enter Height"
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>Width</label>
              <input
                type="text"
                name="width"
                value={formData.width || ""}
                placeholder="Enter Width"
                onChange={handleChange}
                className="form-input"
              />
            </div>
          </div>
          <div>
            <div className="form-group">
              <label>Product Images</label>
              <input
                type="file"
                name="img"
                onChange={handleChange}
                multiple
                className="form-input"
                ref={fileInputRef}
                required
              />
            </div>
            <div className="form-group">
              <label>Available Months</label>
              <div className="flex gap-3">
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
            </div>
            <div className="form-group">
              {formData.month.map((month, index) => (
                <div key={index} className="flex gap-2">
                  <label>
                    {month} months - ₹{formData.rentalOptions[month]}
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prevData) => {
                        const updatedMonths = prevData.month.filter(
                          (m) => m !== month
                        );
                        const { [month]: removed, ...remainingRentalOptions } =
                          prevData.rentalOptions;
                        return {
                          ...prevData,
                          month: updatedMonths,
                          rentalOptions: remainingRentalOptions,
                        };
                      })
                    }
                    className="remove-button text-red-500"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity || ""}
                placeholder="Enter Stock"
                onChange={handleChange}
                min="0"
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label>Weight</label>
              <input
                type="text"
                name="weight"
                value={formData.weight || ""}
                placeholder="Enter Weight"
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>HSN Code</label>
              <input
                type="text"
                name="hsncode"
                value={formData.hsncode || ""}
                placeholder="Enter HSN Code"
                onChange={handleChange}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label>HSN Bar Code</label>
              <input
                type="file"
                name="hsnbarcode"
                onChange={handleChange}
                multiple
                className="form-input"
              />
            </div>
            {submitError && <div className="error-message">{submitError}</div>}
          </div>
        </div>
        <button
          type="submit"
          className="submit-button hover:text-white bg-[#FFD74D]"
          disabled={loading}
        >
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

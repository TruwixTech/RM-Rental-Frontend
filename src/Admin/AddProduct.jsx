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
    description: "",
    fabricCare: {
      material: "",
      color: [],
    },
    woodType: {
      material: "",
      color: [],
    },
    seatingCapacity: [],
    configType: [],
    colorOptions: [],
    month: [],
    size: "",
    rent3Months: null,
    rent6Months: null,
    rent9Months: null,
    rent12Months: null,
  });

  const [newFabricColor, setNewFabricColor] = useState(null);
  const [fabricColors, setFabricColors] = useState([]);
  const [newWoodColor, setNewWoodColor] = useState(null);
  const [woodColors, setWoodColors] = useState([]);
  const [newMonth, setNewMonth] = useState(null);
  const [newRentPrice, setNewRentPrice] = useState(null);

  const [submitError, setSubmitError] = useState(null);
  const token = localStorage.getItem("token");

  const [newSeatingCapacity, setNewSeatingCapacity] = useState(null);

  const [newConfigType, setNewConfigType] = useState(null);

  const [newColorOption, setNewColorOption] = useState(null);
  const [colorOptions, setColorOptions] = useState([]);

  const fileInputRef = useRef(null);

  const handleSeatingCapacityChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value.trim() !== "") {
      setNewSeatingCapacity(value);
    }
  };

  const addSeatingCapacity = () => {
    const capacity = parseInt(newSeatingCapacity, 10);
    if (!isNaN(capacity) && !formData.seatingCapacity.includes(capacity)) {
      setFormData((prevData) => ({
        ...prevData,
        seatingCapacity: [...prevData.seatingCapacity, capacity],
      }));
      setNewSeatingCapacity("");
    }
  };

  const handleConfigType = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value.trim() !== "") {
      setNewConfigType(value);
    }
  };

  const addHandleConfigType = () => {
    const SetConfigType = parseInt(newConfigType, 10);
    if (!isNaN(SetConfigType) && !formData.configType.includes(SetConfigType)) {
      setFormData((prevData) => ({
        ...prevData,
        configType: [...prevData.configType, SetConfigType],
      }));
      setNewConfigType("");
    }
  };

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

  const handleFabricCareChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      fabricCare: {
        ...prevData.fabricCare,
        [field]: value,
      },
    }));
  };

  const handleWoodTypeChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      woodType: {
        ...prevData.woodType,
        [field]: value,
      },
    }));
  };

  const handleFabricColorChange = (color) => {
    const updatedColors = formData.fabricCare.color.includes(color)
      ? formData.fabricCare.color.filter((c) => c !== color)
      : [...formData.fabricCare.color, color];
    handleFabricCareChange("color", updatedColors);
  };

  const handleWoodColorChange = (color) => {
    const updatedColors = formData.woodType.color.includes(color)
      ? formData.woodType.color.filter((c) => c !== color)
      : [...formData.woodType.color, color];
    handleWoodTypeChange("color", updatedColors);
  };

  const addFabricColor = () => {
    if (newFabricColor && !fabricColors.includes(newFabricColor)) {
      const updatedColors = [...fabricColors, newFabricColor];
      setFabricColors(updatedColors);
      setNewFabricColor("");
    }
  };

  const addWoodColor = () => {
    if (newWoodColor && !woodColors.includes(newWoodColor)) {
      const updatedColors = [...woodColors, newWoodColor];
      setWoodColors(updatedColors);
      setNewWoodColor("");
    }
  };

  const addMonthAndRent = () => {
    const month = parseInt(newMonth, 10);

    if (!formData.month.includes(month) && newRentPrice) {
      setFormData((prevData) => ({
        ...prevData,
        month: [...prevData.month, month],
      }));

      if (month === 3) {
        setFormData((prevData) => ({
          ...prevData,
          rent3Months: newRentPrice,
        }));
      } else if (month === 6) {
        setFormData((prevData) => ({
          ...prevData,
          rent6Months: newRentPrice,
        }));
      } else if (month === 9) {
        setFormData((prevData) => ({
          ...prevData,
          rent9Months: newRentPrice,
        }));
      } else if (month === 12) {
        setFormData((prevData) => ({
          ...prevData,
          rent12Months: newRentPrice,
        }));
      }

      // Reset the input fields to empty strings
      setNewMonth("");
      setNewRentPrice("");
    }
  };

  const handleColorOptionChange = (color) => {
    const updatedColors = formData.colorOptions.includes(color)
      ? formData.colorOptions.filter((c) => c !== color)
      : [...formData.colorOptions, color];
    setFormData((prevData) => ({
      ...prevData,
      colorOptions: updatedColors,
    }));
  };

  const addColorOption = () => {
    if (newColorOption && !colorOptions.includes(newColorOption)) {
      const updatedOptions = [...colorOptions, newColorOption];
      setColorOptions(updatedOptions);
      setNewColorOption("");
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
      } else if (key === "fabricCare" || key === "woodType") {
        Object.keys(formData[key]).forEach((subKey) => {
          if (Array.isArray(formData[key][subKey])) {
            formData[key][subKey].forEach((item) => {
              data.append(`${key}[${subKey}][]`, item);
            });
          } else {
            data.append(`${key}[${subKey}]`, formData[key][subKey]);
          }
        });
      } else if (key === "month") {
        formData[key].forEach((month) => {
          data.append("month[]", month);
        });
      } else if (key === "seatingCapacity") {
        formData[key].forEach((capacity) => {
          data.append("seatingCapacity[]", capacity);
        });
      } else if (key === "configType") {
        formData[key].forEach((SetConfigType) => {
          data.append("configType[]", SetConfigType);
        });
      } else if (key === "colorOptions") {
        formData[key].forEach((colorOption) => {
          data.append("colorOptions[]", colorOption);
        });
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

      toast.success("Product created!");

      // Reset form data and other states
      setFormData({
        title: "",
        sub_title: "",
        category: "",
        img: [], // Clear file input
        description: "",
        fabricCare: {
          material: "",
          color: [],
        },
        size: "", // Reset size
        woodType: {
          material: "",
          color: [],
        },
        seatingCapacity: [],
        configType: [],
        colorOptions: [],
        month: [], // Reset month and rent
      });

      setNewFabricColor(""); // Reset new color inputs
      setNewWoodColor("");
      setNewMonth(""); // Reset month input field
      setNewRentPrice(""); // Reset rent input field

      // Clear the file input field manually using the ref
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      toast.error("Something went wrong! Try again later!");
      setSubmitError(err.response?.data?.error || "An error occurred");
    }
  };


  return (
    <div className="add-product">
      <h2 className="mb-10 text-center overflow-hidden font-semibold text-2xl">
        Add Product
      </h2>
      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="flex gap-20">
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
              />
            </div>
            <div className="form-group">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="p-2"
              >
                <option value="">Select Category</option>
                <option value="appliance">Appliance</option>
                <option value="sofa">Sofa</option>
                <option value="kitchen">Kitchen</option>
                <option value="storage">Storage</option>
                <option value="bed">Bed</option>
                <option value="bath">Bath</option>
                <option value="chair">Chair</option>
              </select>
            </div>
            <div className="form-group">
              <label>Product Images</label>
              <input
                type="file"
                name="img"
                onChange={handleChange}
                multiple
                className="form-input"
                ref={fileInputRef} //
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <input
                type="text"
                onChange={handleChange}
                value={formData.description}
                name="description"
              />
            </div>
            <div className="form-group">
              <label>Fabric Care Details</label>

              <input
                type="text"
                name="material"
                value={formData.fabricCare.material}
                placeholder="Material"
                onChange={(e) =>
                  handleFabricCareChange("material", e.target.value)
                }
                className="form-input"
              />
            </div>
            <div className="form-group">
              <select
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
              >
                <option value="">Select Size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
            <div className="form-group">
              <label className="m-0">Fabric Color</label>
              {fabricColors.map((color, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    id={color}
                    value={color}
                    checked={formData.fabricCare.color.includes(color)}
                    onChange={() => handleFabricColorChange(color)}
                    className="form-input"
                  />
                  <label htmlFor={color}>{color}</label>
                </div>
              ))}
            </div>
            <div className="form-group">
              <input
                type="text"
                value={newFabricColor}
                placeholder="Add a color"
                onChange={(e) => setNewFabricColor(e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                onClick={addFabricColor}
                className="submit-button  text-black bg-[#FFD74D] hover:bg-[#ffd84d7a]"
              >
                Add Fabric Color
              </button>
            </div>
            <div className="form-group">
              <label>Wood Type Details</label>

              <input
                type="text"
                name="material"
                value={formData.woodType.material}
                placeholder="Material"
                onChange={(e) =>
                  handleWoodTypeChange("material", e.target.value)
                }
                className="form-input"
              />
            </div>
          </div>
          <div>
            <div className="form-group">
              <label className="m-0">Wood Color</label>
              {woodColors.map((color, index) => (
                <div key={index}>
                  <input
                    type="checkbox"
                    id={color}
                    value={color}
                    checked={formData.woodType.color.includes(color)}
                    onChange={() => handleWoodColorChange(color)}
                    className="form-input"
                  />
                  <label htmlFor={color}>{color}</label>
                </div>
              ))}
            </div>
            <div className="form-group">
              <input
                type="text"
                value={newWoodColor}
                placeholder="Add a color"
                onChange={(e) => setNewWoodColor(e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                onClick={addWoodColor}
                className="submit-button  text-black bg-[#FFD74D]"
              >
                Add Wood Color
              </button>
            </div>
            <div className="form-group">
              <label>Seating Capacity</label>

              <input
                type="number"
                value={newSeatingCapacity}
                placeholder="Add a capacity"
                onChange={handleSeatingCapacityChange}
                className="form-input"
              />
              <button
                type="button"
                onClick={addSeatingCapacity}
                className="submit-button  text-black bg-[#FFD74D]"
              >
                Add Seating Capacity
              </button>
            </div>
            <div className="form-group">
              {formData.seatingCapacity.map((capacity, index) => (
                <div key={index}>
                  <span>{capacity}</span>
                </div>
              ))}
            </div>
            <div className="form-group">
              <label>Config Type (Number)</label>
              <input
                type="number"
                value={newConfigType}
                placeholder="Add a config Type"
                onChange={handleConfigType}
                className="form-input"
              />
              <button
                type="button"
                onClick={addHandleConfigType}
                className="submit-button  text-black bg-[#FFD74D]"
              >
                Add Config Type
              </button>
            </div>
            <div className="form-group">
              {formData.configType.map((SetConfigType, index) => (
                <div key={index}>
                  <span>{SetConfigType}</span>
                </div>
              ))}
            </div>
            <div className="form-group">
              <label>Color Options</label>

              <input
                type="text"
                value={newColorOption}
                placeholder="Add a color option"
                onChange={(e) => setNewColorOption(e.target.value)}
                className="form-input"
              />
              <button
                type="button"
                onClick={addColorOption}
                className="submit-button  text-black bg-[#FFD74D]"
              >
                Add Color Option
              </button>
            </div>
            <div>
              {colorOptions.map((color, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    checked={formData.colorOptions.includes(color)}
                    onChange={() => handleColorOptionChange(color)}
                  />
                  {color}
                </label>
              ))}
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
                  className="fomr-input"
                />
              </div>
              <button
                type="button"
                onClick={addMonthAndRent}
                className="submit-button  text-black bg-[#FFD74D]"
              >
                Add Month & Rent
              </button>
            </div>
            <div className="form-group">
              {formData.month.map((month, index) => (
                <div key={index}>
                  <label>{month}</label>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        month: formData.month.filter((m) => m !== month),
                      })
                    }
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            {submitError && <div className="error-message">{submitError}</div>}
          </div>
        </div>
        <button type="submit" className="submit-button text-black bg-[#FFD74D]">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;

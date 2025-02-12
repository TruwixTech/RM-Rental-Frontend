import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios for API calls
import User from "../assets/img/user.png";
import storageService from "../service/storage.service";
import { AXIOS_INSTANCE } from "../service";


function EditProfile() {
    // State to store user input
    const [userData, setUserData] = useState({
        new_name: "",
        new_email: "",
        new_mobileNumber: "",
        new_address: "",
    });

    const user = storageService.get("user");
    const [loading, setLoading] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await AXIOS_INSTANCE.post("/user-update", { ...userData, userID: user._id });
            // console.log(response.data);
            if (response.data.success) {
                alert("Profile updated successfully!");
            }
        } catch (error) {
            alert("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const getUser = async () => {
        setLoading(true);
        try {
            const response = await AXIOS_INSTANCE.post("/user-details", {id: user._id});
            setUserData({
                new_name: response.data.user.name,
                new_email: response.data.user.email,
                new_mobileNumber: response.data.user.mobileNumber,
                new_address: response.data.user.address
            })
        } catch (error) {
            alert("Failed to get profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser()
    }, [])

    return (
        <div className="w-full h-auto flex flex-col py-10 px-5 md:px-10 lg:px-20">
            {/* Profile Picture */}
            <div className="w-full flex justify-center items-center mb-6">
                <img
                    src={User}
                    alt="User Logo"
                    className="w-24 h-24 lg:w-36 lg:h-36 object-cover bg-yellow-400 rounded-full"
                />
            </div>

            {/* Form */}
            <form
                className="w-full max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-semibold text-center mb-4">Edit Profile</h2>

                <div className="mb-4 px-1 pb-1">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="new_name"
                        value={userData.new_name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="mb-4 px-1 pb-1">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="new_email"
                        value={userData.new_email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="mb-4 px-1 pb-1">
                    <label className="block text-gray-700">Mobile Number</label>
                    <input
                        type="text"
                        name="new_mobileNumber"
                        value={userData.new_mobileNumber}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <div className="mb-4 px-1 pb-1">
                    <label className="block text-gray-700">Address</label>
                    <input
                        type="text"
                        name="new_address"
                        value={userData.new_address}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
}

export default EditProfile;

import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios for API calls
import User from "../assets/img/user.png";
import storageService from "../service/storage.service";
import { AXIOS_INSTANCE } from "../service";
import toast from "react-hot-toast"; // For notifications

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
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [mobileChanged, setMobileChanged] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });

        // Detect mobile number change
        if (name === "new_mobileNumber") {
            setMobileChanged(true);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // If mobile number changed, verify OTP first
        if (mobileChanged && !otp) {
            toast.error("Please verify your new mobile number first.");
            setLoading(false);
            return;
        }

        try {
            const response = await AXIOS_INSTANCE.post("/user-update", { ...userData, userID: user._id });
            if (response.data.success) {
                toast.success("Profile updated successfully!");
                setMobileChanged(false);
            }
        } catch (error) {
            toast.error("Failed to update profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Get user details
    const getUser = async () => {
        setLoading(true);
        try {
            const response = await AXIOS_INSTANCE.post("/user-details", { id: user._id });
            setUserData({
                new_name: response.data.user.name,
                new_email: response.data.user.email,
                new_mobileNumber: response.data.user.mobileNumber,
                new_address: response.data.user.address
            });
        } catch (error) {
            toast.error("Failed to get profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Send OTP
    const sendOTP = async () => {
        if (userData.new_mobileNumber?.length !== 10) {
            alert("Enter a valid 10-digit mobile number.");
            return;
        }

        try {
            const response = await AXIOS_INSTANCE.post(`/verifysend/${userData.new_mobileNumber}`);
            if (response.data.success) {
                alert("OTP sent successfully!");
                setOtpSent(true);
                setOtpTimer(60);
            } else {
                alert("Failed to send OTP. Please try again.");
            }
        } catch (error) {
            alert("Error sending OTP.");
        }
    };

    // Verify OTP
    const verifyOTP = async () => {
        try {
            const response = await AXIOS_INSTANCE.get(`/verifycheck/${userData.new_mobileNumber}/${otp}`);
            if (response.data.success) {
                alert("Mobile number verified!");
                setMobileChanged(false);
                setOtpSent(false);
                setOtpVerified(true);
                setOtpTimer(0);
            } else {
                alert("Invalid OTP. Please try again.");
            }
        } catch (error) {
            alert("Failed to verify OTP.");
        }
    };

    // OTP Timer Countdown
    useEffect(() => {
        let timer;
        if (otpTimer > 0) {
            timer = setInterval(() => {
                setOtpTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [otpTimer]);

    useEffect(() => {
        getUser();
    }, []);

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

                {/* Name */}
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

                {/* Email */}
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

                {/* Mobile Number with OTP Verification */}
                <div className="mb-4 px-1 pb-1">
                    <label className="block text-gray-700">Mobile Number</label>
                    <div className="flex gap-2 flex-wrap">
                        <input
                            type="text"
                            name="new_mobileNumber"
                            value={userData.new_mobileNumber}
                            onChange={handleChange}
                            disabled={otpVerified}
                            maxLength={10}
                            className="w-full sm:w-[75%] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="button"
                            className={`px-3 py-2 bg-blue-500 text-white rounded-md ${otpTimer > 0 ? "cursor-not-allowed" : "hover:bg-blue-600"}`}
                            disabled={otpTimer > 0}
                            onClick={sendOTP}
                        >
                            {otpTimer > 0 ? `Wait ${otpTimer}s` : "Send OTP"}
                        </button>
                    </div>
                </div>

                {/* OTP Input (only when OTP sent) */}
                {otpSent && (
                    <div className="mb-4 px-1 pb-1">
                        <label className="block text-gray-700">Enter OTP</label>
                        <div className="flex gap-2 flex-wrap">
                            <input
                                type="text"
                                name="otp"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                maxLength={6}
                                className="w-full sm:w-[70%] px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                            <button
                                type="button"
                                className="px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                onClick={verifyOTP}
                            >
                                Verify OTP
                            </button>
                        </div>
                    </div>
                )}

                {/* Address */}
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

                {/* Submit Button */}
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

/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/csss/SignUp.css";
import userService from "../service/user.service";
import storageService from "../service/storage.service";
import toast from "react-hot-toast";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const SignUp = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [mobileNumber, setMobileNumber] = useState("");
  const [inputOTP, setInputOTP] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const responseMessage = async (response) => {
    console.log("Google response:", response);

    try {
      const { credential } = response;
      const idToken = credential;

      const credentials = jwtDecode(idToken);
      console.log("Decoded credentials:", credentials);

      const res = await userService.googleOAuth(idToken);

      if (res.status === 200) {
        const { token } = res.data;
        console.log("data", res.data);
        localStorage.setItem("authToken", token);
        storageService.save("token", res.data.token);
        storageService.save("user", res.data.user);
        toast.success("Login successful");
        navigate("/");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.error("Error during Google login:", error);
    }
  };

  const errorMessage = (error) => {
    toast.error("Something Went Wrong!");
  };
  const handleSubmit = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const verifyOTP = await userService.verifyOTP(mobileNumber, inputOTP);
      console.log(verifyOTP);

      if (verifyOTP.success) {
        const data = await userService.registerAPI(
          formData.name,
          formData.email,
          formData.password,
          mobileNumber
        );

        if (data) {
          storageService.save("token", data.token);
          storageService.save("user", data.user);
          toast.success("Registration successful");

          // Clear all form fields on successful registration
          setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
          });
          setInputOTP("");
          setMobileNumber("");

          navigate("/login"); // Redirect after success
        } else {
          toast.error(data?.message);
        }
      } else {
        toast.error("OTP Verification Failed");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again."); // Set error message
    }

    setLoading(false); // Set loading to false regardless of success or failure
  };

  const handleGetOTP = async () => {
    const data = await userService.getOTP(mobileNumber);

    if (data.success) {
      toast.success("OTP Sent Successfully");
      setOtpTimer(60); // Start the OTP timer for 60 seconds
    } else {
      toast.error("Error sending OTP");
    }
  };

  // Effect to handle the countdown timer for OTP resend
  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer); // Clear interval on component unmount
  }, [otpTimer]);

  // Function to check if all fields are filled
  const isFormValid = () => {
    return (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      mobileNumber.length === 10 &&
      inputOTP.length === 6
    );
  };

  return (
    <div className="wrapper">
      <div className="sign-up-container">
        <div className="flex justify-center items-center mb-2">
          <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        </div>
        <div className="flex justify-center items-center">OR</div>
        <div className="text-center text-2xl font-bold">Sign Up</div>
        <div className="sign-up-form mt-4">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name} // Added value to bind input field
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email} // Added value to bind input field
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password} // Added value to bind input field
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword} // Added value to bind input field
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              value={mobileNumber} // Added value to bind input field
              onChange={(e) => setMobileNumber(e.target.value)}
              required
              maxLength={10}
              minLength={10}
            />
          </div>
          {mobileNumber && (
            <div className="form-group">
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700"
              >
                OTP
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={inputOTP} // Added value to bind input field
                  maxLength={6}
                  minLength={6}
                  pattern="\d{6}" // Ensures it only accepts 6 digits
                  onChange={(e) => setInputOTP(e.target.value)}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter 6-digit OTP"
                />
                <button
                  className={`border rounded-md max-w-24 w-24 border-gray-400 font-lg hover:bg-blue-500 hover:text-white ${
                    mobileNumber.length === 10 && otpTimer === 0
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  }`}
                  disabled={mobileNumber.length !== 10 || otpTimer > 0} // Button disabled if mobileNumber is not 10 digits or timer is active
                  onClick={handleGetOTP}
                >
                  {otpTimer > 0 ? `Wait ${otpTimer}s` : "Get OTP"}
                </button>
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            type="submit"
            disabled={loading || !isFormValid()} // Disable button if loading or form is not valid
            className={`submit-button ${
              loading || !isFormValid()
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
        <p className="login-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;

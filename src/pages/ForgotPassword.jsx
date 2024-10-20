import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/csss/SignUp.css";
import userService from "../service/user.service";
import toast from "react-hot-toast";
import storageService from "../service/storage.service";


const ForgotPassword = () => {
  const navigate = useNavigate();
  const user = storageService.get("user");
  if(user) {
    navigate("/products");
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [mobileNumber, setMobileNumber] = useState("");
  const [inputOTP, setInputOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);
  const [step, setStep] = useState(1); // 1 for mobile input, 2 for OTP verification, 3 for new password

  const handleGetOTP = async () => {
    setLoading(true);
    const data = await userService.getOTP(mobileNumber);

    if (data.success) {
      toast.success("OTP Sent Successfully");
      setOtpTimer(60); // Start the OTP timer for 60 seconds
      setStep(2); // Move to OTP input step
    } else {
      toast.error("Error sending OTP");
    }

    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    try {
      const verifyOTP = await userService.verifyOTP(mobileNumber, inputOTP);

      if (verifyOTP.success) {
        setStep(3); // Move to new password input step
      } else {
        toast.error("OTP Verification Failed");
        setMobileNumber(""); // Clear mobile number input
        setInputOTP(""); // Clear OTP input
        setStep(1); // Go back to mobile input step
      }
    } catch (error) {
      toast.error("OTP Verification Failed!");
      setMobileNumber(""); // Clear mobile number input
      setInputOTP(""); // Clear OTP input
      setStep(1); // Go back to mobile input step
    }

    setLoading(false);
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setError(null); // Clear any previous errors

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const data = await userService.resetPassword(mobileNumber, newPassword);

      if (data.success) {
        toast.success("Password reset successful");
        navigate("/login"); // Redirect to login page after success
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }

    setLoading(false);
  };

  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer); // Clear interval on component unmount
  }, [otpTimer]);

  return (
    <div className="wrapper">
      <div className="sign-up-container">
        <div className="text-center text-2xl font-bold">Forgot Password</div>
        <div className="sign-up-form mt-4">
          {step === 1 && (
            <div className="form-group">
              <label htmlFor="mobileNumber">Mobile Number</label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                required
                maxLength={10}
                minLength={10}
              />
              <button
                onClick={handleGetOTP}
                disabled={loading || mobileNumber.length !== 10}
                className="submit-button"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={inputOTP}
                maxLength={6}
                minLength={6}
                pattern="\d{6}"
                onChange={(e) => setInputOTP(e.target.value)}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter 6-digit OTP"
              />
              <button
                onClick={handleVerifyOTP}
                disabled={loading || inputOTP.length !== 6} // Disable if OTP length is not 6
                className="submit-button"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </div>
          )}

          {step === 3 && (
            <>
              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmNewPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  required
                />
              </div>
              <button
                onClick={handleResetPassword}
                disabled={loading || !newPassword || !confirmNewPassword}
                className="submit-button"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </>
          )}

          {error && <p className="error-message">{error}</p>}
        </div>
        <p className="login-link">
          Remembered your password? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;

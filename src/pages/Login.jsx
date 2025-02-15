/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/csss/Login.css";
import userService from "../service/user.service";
import toast from "react-hot-toast";
import storageService from "../service/storage.service";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { error } from "jquery";
import { AXIOS_INSTANCE } from "../service";

const Login = () => {
  const navigate = useNavigate();
  const [termsCondition, setTermsCondition] = useState(false)
  const [user,setUser] = useState({})
  const [loginWay, setLoginWay] = useState('Email')
  const [formData2, setFormData2] = useState({
    phone: "",
    otp: "",
  })

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    loading: false,
  });
  const [otpSent, setOtpSent] = useState(false); // Track OTP sent status
  const [otpVerified, setOtpVerified] = useState(false); // Track OTP verification


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const responseMessage = async (response) => {
    try {
      const { credential } = response;
      const idToken = credential;

      const credentials = jwtDecode(idToken);


      const res = await userService.googleOAuth(idToken);

      if (res.status === 200) {
        const { token } = res.data;
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      loading: true,
    });

    try {
      const data = await userService.loginAPI(
        formData.email,
        formData.password
      );
      if (data) {
        storageService.save("token", data.token);
        storageService.save("user", data.user);
        toast.success("Login successful");
        if (data.user.role === "Admin") {
          navigate("/admindashboard");
        } else {
          navigate("/");
        }
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        throw new Error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Invalid email or password");
      setFormData({
        ...formData,
        loading: false, // Reset the loading state so the button is clickable again
      });
    }
  };

  async function handleSubmitMobile() {

    try {
      const response = await AXIOS_INSTANCE.post('/verify-otp', {
        mobileNumber: formData2.phone,
        code: formData2.otp
      })
      if (response.data.success) {
        // console.log(response)
        storageService.save("token", response.data.token);
        storageService.save("user", response.data.gotUser);
        setUser(response.data.gotUser)
        setOtpVerified(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function getOtp() {
    try {
      await AXIOS_INSTANCE.post('/test-otp', {
        mobileNumber: formData2.phone
      })
      alert("Otp sent successfully")
      setOtpSent(true)
    } catch (error) {
      console.log(error)
    }
  }

  function handleSubmitLogin(e) {
    e.preventDefault()
    try {
      if (otpVerified) {
        if (user.role === "Admin") {
          navigate("/admindashboard");
        } else {
          navigate("/");
        }
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="wrapper">
      <div className="login-container">
        <div className="flex justify-center items-center mb-2">
          <GoogleLogin onSuccess={responseMessage} onError={errorMessage} />
        </div>
        <div className="flex justify-center items-center">OR</div>
        <div className="text-center text-2xl font-bold">Login</div>
        <div className="w-full h-auto flex flex-col sm:flex-row gap-2 mt-3 text-sm">
          <span onClick={() => setLoginWay('Email')} className={`${loginWay === 'Email' && 'bg-[#FFD74D] text-white'} px-3 p-2 border-2 border-[#ffd74d] text-center rounded-full cursor-pointer`}>
            Login with Email
          </span>
          <span onClick={() => setLoginWay('Phone')} className={`${loginWay === 'Phone' && 'bg-[#FFD74D] text-white'} px-3 p-2 border-2 border-[#ffd74d] text-center rounded-full cursor-pointer`}>
            Login with Phone
          </span>
        </div>
        {
          loginWay === 'Email' && (
            <form onSubmit={handleSubmit} className="login-form mt-4">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                />
              </div>
              <div className="w-full h-auto flex gap-2 items-center">
                <input type="checkbox" id="terms" value={termsCondition} onChange={() => setTermsCondition(!termsCondition)} className="" />
                <label htmlFor="terms">
                  I agree to the{" "}
                  <Link to="/termscondition" className="text-[#FFD74D]">
                    Terms and Conditions
                  </Link>
                </label>
              </div>
              <button
                id="login-button"
                type="submit"
                disabled={formData.loading || !termsCondition}
                className="submit-button"
                style={{ backgroundColor: "#FFD74D", color: "#000" }}
              >
                {formData.loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )
        }
        {
          loginWay === 'Phone' && (
            <form onSubmit={handleSubmitLogin} className="login-form mt-4">
              {/* Phone Number Input */}
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  onChange={(e) => setFormData2({ ...formData2, phone: e.target.value })}
                  value={formData2.phone}
                  maxLength="10"
                />
              </div>

              {/* Get OTP Button */}
              {!otpSent && formData2.phone.length === 10 && (
                <button
                  type="button"
                  className="otp-button py-2"
                  onClick={getOtp}
                  style={{ backgroundColor: "#FFD74D", color: "#000", marginBottom: "10px" }}
                >
                  Get OTP
                </button>
              )}

              {/* OTP Input */}
              {otpSent && (
                <div className="form-group">
                  <label htmlFor="otp">Enter OTP</label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    placeholder="Enter received OTP"
                    onChange={(e) => setFormData2({ ...formData2, otp: e.target.value })}
                    value={formData2.otp}
                    maxLength="6"
                  />
                  {
                    !otpVerified && (
                      <button
                        type="button"
                        className="verify-otp-button py-2 px-3 rounded-lg"
                        onClick={handleSubmitMobile}
                        style={{ backgroundColor: "#FFD74D", color: "#000", marginTop: "5px" }}
                      >
                        Verify OTP
                      </button>
                    )
                  }
                </div>
              )}

              {/* Terms and Conditions */}
              <div className="w-full h-auto flex gap-2 items-center">
                <input
                  type="checkbox"
                  id="terms"
                  checked={termsCondition}
                  onChange={() => setTermsCondition(!termsCondition)}
                />
                <label htmlFor="terms">
                  I agree to the{" "}
                  <Link to="/termscondition" className="text-[#FFD74D]">
                    Terms and Conditions
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!termsCondition || !otpVerified}
                className="submit-button"
                style={{ backgroundColor: otpVerified ? "#FFD74D" : "#ccc", color: "#000" }}
              >
                {formData.loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )
        }

        <p className="signup-link">
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
        <p className="signup-link">
          Forgot your password? <Link to="/password">Reset</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

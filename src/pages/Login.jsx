import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/csss/Login.css";
import userService from "../service/user.service";
import toast from "react-hot-toast";
import storageService from "../service/storage.service";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    loading: false,
  });
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({
      ...formData,
      loading: true,
    });
    const data = await userService.loginAPI(formData.email, formData.password);
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
      alert("Invalid email or password");
    }
  };

  return (
    <div className="wrapper">
      <div className="login-container">
        <h2>Login</h2>
        <div onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            disabled={formData?.loading}
            className="submit-button"
            onClick={handleSubmit}
            style={{ backgroundColor: "#FFD74D", color: "#000" }}
          >
            {formData?.loading ? "Logging in..." : "Login"}
          </button>
        </div>
        <p className="signup-link">
          Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

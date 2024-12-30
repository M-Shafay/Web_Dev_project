import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import '../../Styles/Signin.css';
import { FaSearch } from "react-icons/fa";

const SignIn = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [errors, setErrors] = useState({}); // State for form validation errors
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear error on change
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // If validation fails, stop here

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      // Store token and role in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      setMessage("Login successful");

      // Redirect user based on role
      if (res.data.role === "Host") {
        navigate("/profile");
      }
      else{
        navigate("/");
      }
    } catch (error) {
      setMessage(error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Signin-pack">
    <form onSubmit={handleSubmit} className="signin-form">
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        value={formData.email}
        required
        className={`signin-input ${errors.email ? "error" : ""}`}
      />
      {errors.email && <p className="error-message">{errors.email}</p>}

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        value={formData.password}
        required
        className={`signin-input ${errors.password ? "error" : ""}`}
      />
      {errors.password && <p className="error-message">{errors.password}</p>}

      <button type="submit" className="signin-button" disabled={loading}>
        {loading ? "Signing In..." : "Sign In"}
      </button>

      {message && <p className="signin-message">{message}</p>}

      <Link to="/signup" className="signup-link">
        Don't have an account? Sign Up
      </Link>
    </form>
    </div>
  );
};

export default SignIn;

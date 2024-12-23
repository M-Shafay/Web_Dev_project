import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../Styles/Signup.css'; // Importing the CSS file

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'Guest', // Default role
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [errors, setErrors] = useState({}); // Validation errors

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' }); // Clear error on change
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Username is required';
    }
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // If validation fails, stop here

    setLoading(true); // Set loading state to true
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      setMessage(res.data.message); // Show success message from the API
    } catch (error) {
      setMessage(error.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false); // Set loading state to false once the request is done
    }
  };

  return (
    <div className='Signup'>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          value={formData.username}
          className={`signup-input ${errors.username ? 'error' : ''}`}
        />
        {errors.username && <p className="error-message">{errors.username}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          value={formData.email}
          className={`signup-input ${errors.email ? 'error' : ''}`}
        />
        {errors.email && <p className="error-message">{errors.email}</p>}

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          value={formData.password}
          className={`signup-input ${errors.password ? 'error' : ''}`}
        />
        {errors.password && <p className="error-message">{errors.password}</p>}

        <label className="signup-role-label">
          <span>Select Role:</span>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="signup-select"
          >
            <option value="Guest">Guest</option>
            <option value="Host">Host</option>
          </select>
        </label>

        <button type="submit" className="signup-button" disabled={loading}>
          {loading ? 'Registering...' : 'Sign Up'}
        </button>

        {message && <p className="signup-message">{message}</p>}

        <Link to="/signin" className="signin-link">
          Already have an account? Sign In
        </Link>
      </form>
    </div>
  );
};

export default SignUp;

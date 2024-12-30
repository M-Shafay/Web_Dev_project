import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import "../../Styles/HostDashBoard.css";

const AdminListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    price: '',
    location: '',
    image_url: '', // Single string for image URL
  });
  const token = localStorage.getItem("token");

  const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/admin`;

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/listings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings(response.data);
    } catch (error) {
      navigate('signin');
      console.error('Error fetching listings:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/listings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setFormData({ ...listing }); // Populate form with existing listing data
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingListing(null);
    setFormData({
      title: '',
      category: '',
      description: '',
      price: '',
      location: '',
      image_url: '', // Reset image_url
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (editingListing) {
        await axios.put(
          `${API_BASE_URL}/listings/${editingListing._id}`,
          formData,
          config
        );
      } else {
        await axios.post(`${API_BASE_URL}/listings`, formData, config);
      }
      fetchListings();
      setShowModal(false);
    } catch (error) {
      console.error('Error saving listing:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Your Listings</h1>
      <button onClick={handleAdd} className="add-button">
        Add Listing
      </button>
      <table className="listings">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing._id}>
              <td>{listing.title}</td>
              <td>{listing.description}</td>
              <td>${listing.price}</td>
              <td>{listing.location}</td>
              <td>
                <button onClick={() => handleEdit(listing)}>Edit</button>
                <button onClick={() => handleDelete(listing._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <h2>{editingListing ? 'Edit Listing' : 'Add Listing'}</h2>
          <form>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
            />
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Category"
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
            ></textarea>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="Price"
            />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Location"
            />
            <input
              type="text"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Image URL"
            />
            <button type="button" onClick={handleSubmit}>
              {editingListing ? 'Save Changes' : 'Add Listing'}
            </button>
            <button type="button" onClick={() => setShowModal(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminListings;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Styles/HomeListings.css";
import { FaSearch } from "react-icons/fa";

const ListingsPage = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]); // All listings
  const [searchQuery, setSearchQuery] = useState(""); // Search query input
  const [searchType, setSearchType] = useState("title"); // Default search type is 'title'
  const [searchResults, setSearchResults] = useState([]); // Filtered search results
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state
  const [category, setCategory] = useState(""); // Category filter

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/listings?category=${category}`
        );
        setListings(res.data);
        setSearchResults(res.data); // Show all listings initially
      } catch (error) {
        setError("Error fetching listings, please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [category]); // Fetch listings whenever category changes

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearchResults([]); // Clear previous results while searching
    const queryParams = {};

    if (searchQuery) queryParams[searchType] = searchQuery; // Dynamically set the query key

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/listings/search`,
        { params: queryParams }
      );
      setSearchResults(response.data);
    } catch (error) {
      setError("Error fetching search results.");
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleListingClick = (listing) => {
    navigate(`/listing/${listing._id}`);
  };

  return (
    <div className="listings-page">
      {/* Search Bar */}
      <div className="listings-page__search-bar">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search by ${searchType}`}
            className="listings-page__search-input"
          />
          <select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            className="listings-page__search-type-select"
          >
            <option value="title">Title</option>
            <option value="category">Category</option>
            <option value="location">Location</option>
            <option value="price">Price</option>
          </select>
          <button type="submit" className="listings-page__search-button">
            <FaSearch className="listings-page__search-icon" />
          </button>
        </form>
      </div>

      <h1 className="listings-page__title">
        {searchQuery
          ? `Results for "${searchQuery}" in ${searchType}`
          : "All Listings"}
      </h1>

      {/* Loading/Error States */}
      {loading ? (
        <p className="listings-page__loading-message">Loading listings...</p>
      ) : error ? (
        <p className="listings-page__error-message">{error}</p>
      ) : searchResults.length > 0 ? (
        <div className="listings-page__grid">
          {searchResults.map((listing) => (
            
            <div
              key={listing._id}
              className="listings-page__card"
              onClick={() => handleListingClick(listing)}
            >
              <img
                src={
                  listing.image_url && listing.image_url.length > 0
                    ? listing.image_url
                    : "path/to/placeholder-image.jpg"
                }
                className="listings-page__image"
                alt={listing.title}
              />
              <h3 className="listings-page__card-title">{listing.title}</h3>
              <p className="listings-page__card-location">{listing.location}</p>
              <p className="listings-page__card-category">{listing.category}</p>
              <p className="listings-page__card-price">
                {listing.price}$/night
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="listings-page__no-listings-message">No listings found.</p>
      )}
    </div>
  );
};

export default ListingsPage;

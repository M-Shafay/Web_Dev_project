import { useState, useEffect } from "react";
import { useParams, Link,useNavigate } from "react-router-dom";
import axios from "axios";
import "../../Styles/Listingdetails.css";

const PropertyDetailsPage = () => {
  const navigate=useNavigate();
  const [property, setProperty] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track current slide
  const [isTransitioning, setIsTransitioning] = useState(false); // Track if transition is in progress
  const { id } = useParams();

  useEffect(() => {
    const loadProperty = async () => {
      try{const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/listings/${id}`
      );
      setProperty(response.data);}
      catch(error){
        navigate("/signin");
      }
    };

    const role = localStorage.getItem("role");
    setIsGuest(role === "Guest");

    loadProperty();
  }, [id]);

  if (!property) return <div className="loading">Loading...</div>;

  // Generate an array of 6 repeated images
  const images = Array(6).fill(property.image_url);

  // Handle next and previous slides
  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true); // Start transition
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };
  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true); // Start transition
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  // Handle the transition end and allow next transition
  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  return (
    <div className="property-details-container">
      <h1 className="property-title">{property.title}</h1>

      <div className="slideshow-container">
        <button className="prev-slide" onClick={prevSlide}>
          ❮
        </button>
        <img
          src={images[currentImageIndex]}
          alt={`${property.title} - Slide ${currentImageIndex + 1}`}
          className={`property-slide-image ${isTransitioning ? "slide-out" : ""}`}
          onTransitionEnd={handleTransitionEnd} // Trigger when the transition ends
        />
        <button className="next-slide" onClick={nextSlide}>
          ❯
        </button>
      </div>

      <div className="property-info">
        <p className="property-description">{property.description}</p>
        <p className="property-location">
          <strong>Location:</strong> {property.location}
        </p>
        <p className="property-price">
          <strong>Price:</strong> ${property.price} per night
        </p>
        {isGuest && (
          <Link to={`/book/${property._id}`}>
            <button className="book-now-button">Book Now</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailsPage;

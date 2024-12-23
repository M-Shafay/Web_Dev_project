const express = require('express');
const Listing = require("../Schemas/listings");
const router = express.Router();

// Fetch all listings (Guest view)
router.get('/listings', async (req, res) => {
  const { category } = req.query; // Get category from query parameters
  try {
    const query = category && category !== "All" ? { category } : {}; // Filter by category if not "All"
    const listings = await Listing.find(query); // Fetch filtered or all listings
    res.json(listings); // Send the listings in response
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Search listings based on dynamic criteria
router.get("/listings/search", async (req, res) => {
  try {
    // Get search criteria from query parameters
    const { title, category, location, price } = req.query;
    
    // Build the filter object based on provided query parameters
    let filter = {};
    
    if (title) {
      filter.title = { $regex: title, $options: 'i' }; // Case-insensitive search for title
    }

    if (category) {
      filter.category = { $regex: category, $options: 'i' }; // Case-insensitive search for category
    }

    if (location) {
      filter.location = { $regex: location, $options: 'i' }; // Case-insensitive search for location
    }

    if (price) {
      const priceRange = price.split('-');
      if (priceRange.length === 2) {
        const minPrice = parseFloat(priceRange[0]);
        const maxPrice = parseFloat(priceRange[1]);
        filter.price = { $gte: minPrice, $lte: maxPrice }; // Filter by price range
      }
      else if (priceRange.length === 1) {
        const minPrice = parseFloat(0);
        const maxPrice = parseFloat(priceRange[0]);
        filter.price = { $gte: minPrice, $lte: maxPrice }; // Filter by price range
      }
    }

    // Fetch listings based on filter
    const listings = await Listing.find(filter);
    
    // Return the found listings
    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong, please try again later." });
  }
});

// Fetch a single listing by ID (Guest view)
router.get('/listings/:id', async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id); // Find listing by ID

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    res.json(listing); // Send the listing details
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

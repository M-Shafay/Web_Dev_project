const express = require('express');
const Listing = require('../Schemas/listings');
const authMiddleware = require('../Authentication_Middleware/authMiddleware');

const router = express.Router();

// Fetch all listings for the logged-in host
router.get('/listings', authMiddleware, async (req, res) => {
  try {
    const hostId = req.user.id; // Extract hostId from token in authMiddleware

    // Find listings where hostId matches
    const listings = await Listing.find({ hostId });

    res.status(200).json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new listing (Host only)
router.post('/listings', authMiddleware, async (req, res) => {
  try {
    const { title, category, description, price, location, image_url } = req.body;

    // Ensure `image_url` is provided and valid
    if (!image_url || typeof image_url !== 'string' || !image_url.trim()) {
      return res.status(400).json({ error: 'You must provide a valid image URL.' });
    }

    // Create a new listing
    const newListing = new Listing({
      title,
      description,
      price,
      location,
      image_url, // Single image URL
      category,
      hostId: req.user.id, // Associate listing with the logged-in host
    });

    // Save to the database
    await newListing.save();

    res.status(201).json({ message: 'Listing created successfully', listing: newListing });
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Edit a listing by ID
router.put('/listings/:id', authMiddleware, async (req, res) => {
  try {
    const { title, category, description, price, location, image_url } = req.body;

    // Find the listing by ID
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Ensure the user is authorized to update the listing
    if (listing.hostId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized action' });
    }

    // Update listing fields
    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.price = price || listing.price;
    listing.location = location || listing.location;
    listing.category = category || listing.category;

    // Update the image URL if provided and valid
    if (image_url && typeof image_url === 'string' && image_url.trim()) {
      listing.image_url = image_url;
    }

    // Save the updated listing
    await listing.save();

    res.status(200).json({ message: 'Listing updated successfully', listing });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete a listing by ID
router.delete('/listings/:id', authMiddleware, async (req, res) => {
  try {
    // Find the listing by ID
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Ensure the user is authorized to delete the listing
    if (listing.hostId.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized action' });
    }

    // Delete the listing
    await Listing.DeleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

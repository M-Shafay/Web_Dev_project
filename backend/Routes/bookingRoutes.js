const express = require('express');
const mongoose = require('mongoose');
const Booking = require('../Schemas/booking');
const Listing = require('../Schemas/listings');
const Users = require('../Schemas/Users'); // Fixed typo
const authMiddleware = require('../Authentication_Middleware/authMiddleware');
const router = express.Router();

// Helper function to normalize dates
const normalizeDate = (date) => new Date(date.toISOString().split('T')[0]);

router.post('/create-booking', authMiddleware, async (req, res) => {
  try {
    const { listingId, checkInDate, checkOutDate, guestCount } = req.body;

    // Log received data for debugging
    console.log('Received booking data:', { listingId, checkInDate, checkOutDate, guestCount });
    console.log('User ID:', req.user.id);

    // Validate ObjectID
    if (!mongoose.Types.ObjectId.isValid(listingId)) {
      return res.status(400).json({ error: 'Invalid listing ID' });
    }

    // Fetch the listing
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    // Validate dates
    const checkIn = normalizeDate(new Date(checkInDate));
    const checkOut = normalizeDate(new Date(checkOutDate));
    const currentDate = normalizeDate(new Date());

    if (checkIn < currentDate) {
      return res.status(400).json({ error: 'Check-in date cannot be in the past' });
    }
    if (checkIn >= checkOut) {
      return res.status(400).json({ error: 'Check-out date must be greater than check-in date' });
    }

    // Check for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      listingId,
      checkIn: { $lt: checkOut },
      checkOut: { $gt: checkIn },
    });

    if (overlappingBooking) {
      return res.status(400).json({ error: 'This listing is already booked for the selected dates' });
    }

    // Calculate total price
    const numDays = (checkOut - checkIn) / (1000 * 60 * 60 * 24); // Days between dates
    const totalPrice = listing.price * guestCount * numDays;

    // Create booking
    const booking = new Booking({
      listingId: mongoose.Types.ObjectId(listingId),
      guestId: mongoose.Types.ObjectId(req.user.id),
      checkIn,
      checkOut,
      numGuests: guestCount,
      totalPrice,
    });

    await booking.save();
    console.log('Booking created successfully:', booking);

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (error) {
    console.error('Error creating booking:', error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Route to fetch bookings for the logged-in guest
router.get('/get-bookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ guestId: req.user.id })
      .populate('listingId', 'title location price image_url')
      .populate('guestId', 'username');

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;

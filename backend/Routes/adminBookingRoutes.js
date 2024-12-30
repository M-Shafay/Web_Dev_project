// adminRoutes.js
const express = require('express');
const Booking = require('../Schemas/booking'); //
const Listing = require('../Schemas/listings');
//const { getHostBookings } = require('../controllers/adminBookingController');
const authMiddleware = require('../Authentication_Middleware/authMiddleware');

const router = express.Router();

// Route to get bookings for host's listings
router.get('/bookings', authMiddleware, async (req, res) => {
    try {
        const hostId = req.user.id; // Extracted from token in authMiddleware

        // Find listings created by the host
        const hostListings = await Listing.find({ hostId });
        const listingIds = hostListings.map(listing => listing._id);

        // Find bookings associated with the host's listings
        const bookings = await Booking.find({ listingId: { $in: listingIds } }).populate('listingId', 'title location').populate('guestId', 'username');;

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;

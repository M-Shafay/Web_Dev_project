const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'listings', required: true },
  guestId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  numGuests: { type: Number, default: 1 },
  totalPrice: { type: Number, required: true },
});

module.exports = mongoose.model('Booking', bookingSchema);

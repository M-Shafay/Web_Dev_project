const express = require('express');
const cors = require('cors');

// Import Routes
const authRoutes = require('./Routes/authRoutes');
const profileRoutes = require('./Routes/profileRoutes');
const HostAdminRoutes = require('./Routes/HostAdminRoutes');
const clientRoutes = require('./Routes/clientRoutes');
const bookingRoutes = require('./Routes/bookingRoutes');
const adminBookingRoutes = require('./Routes/adminBookingRoutes');

const mongoose = require('mongoose');
// monog db conneciton
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', HostAdminRoutes);
app.use('/api/', clientRoutes);
app.use('/api/Booking', bookingRoutes);
app.use('/api/admin-bookings', adminBookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

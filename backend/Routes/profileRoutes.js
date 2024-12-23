const express = require('express');
const User = require('../Schemas/Users');
const bcrypt = require('bcryptjs'); // For password hashing
const authMiddleware = require('../Authentication_Middleware/authMiddleware');
const router = express.Router();

// Get user profile
router.get('/', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found' });

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Update user profile
// In your profile routes (e.g., profileController.js)

router.put('/', authMiddleware, async (req, res) => {
  try {
    const { dob, contact, bio } = req.body;

    // Check if the user provided any data for update
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, // The authenticated user
      { dob, contact, bio }, // Update the relevant fields
      { new: true } // Return the updated document
    ).select('-password'); // Do not return the password field

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(updatedUser); // Send the updated user data back
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update password
router.put('/update-password', authMiddleware, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Check if current password is correct
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });


        // Update the password
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;




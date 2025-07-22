// routes/experiencebooking.js
const express = require('express');
const router = express.Router();
const ExperienceBooking = require('../models/ExperienceBooking');

router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await ExperienceBooking.find({ userId: req.params.userId });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch experience bookings' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const booking = await ExperienceBooking.findById(req.params.id);
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: 'Booking not found' });
  }
});

// GET all experience bookings for a user



module.exports = router;

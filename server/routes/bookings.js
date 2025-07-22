// routes/bookings.js

const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');

router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('homeId');
    res.json(booking);
  } catch (err) {
    res.status(400).json({ error: 'Booking not found' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.params.userId }).populate('homeId');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

module.exports = router;

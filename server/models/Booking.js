// models/Booking.js
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  homeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  startDate: Date,
  endDate: Date,
  totalPrice: Number,
  status: {
    type: String,
    default: 'pending'
  },
  name: String,
  address: String,
  photo: String
});

module.exports = mongoose.model('Booking', bookingSchema);

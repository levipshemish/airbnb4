// models/ServiceBooking.js
const mongoose = require('mongoose');

const serviceBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  serviceTitle: { type: String, required: true },
  servicePhoto: { type: String, required: true },
  serviceLocation: { type: String, required: true },
  servicePrice: { type: Number, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('ServiceBooking', serviceBookingSchema);

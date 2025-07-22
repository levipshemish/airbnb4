const mongoose = require('mongoose');

const experienceBookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience', required: true },
  experienceTitle: { type: String, required: true },
  experienceAddress: { type: String, required: true },
  experiencePhoto: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
});

module.exports = mongoose.model('ExperienceBooking', experienceBookingSchema);

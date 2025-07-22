const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  text: { type: String, required: true },
  address: { type: String, required: true },
  price: { type: Number, required: true },
  photos: { type: [String], required: true },
  city: { type: String, required: true },
  maxGuest: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Home', homeSchema);

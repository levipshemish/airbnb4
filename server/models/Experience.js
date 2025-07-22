const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  maxGuests: { type: Number, required: true },
  photos: [{ type: String, required: true }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = mongoose.model('Experience', experienceSchema);

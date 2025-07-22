const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  text: String, // hashed password
});

module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');

const messSchema = new mongoose.Schema({
  date: String,
  breakfast: String,
  lunch: String,
  dinner: String,
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Mess', messSchema);

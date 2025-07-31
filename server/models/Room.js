const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomNumber: { type: String, required: true },
  hostelBlock: { type: String, required: true },
  capacity: { type: Number, default: 1 },
  occupied: { type: Number, default: 0 },
  beds: [
    {
      bedNumber: Number,
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }
    }
  ]
});

module.exports = mongoose.model("Room", roomSchema);

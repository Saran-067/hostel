import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  hostel: { type: String, required: true, default: "PSG MAIN" },
  block: { type: String, required: true },
  floor: { type: String, required: true },
  roomNo: { type: String, required: true },
  roomType: { type: String, required: true }, // e.g., "New 3 In 1 Room"
  occupancy: { type: Number, default: 0 }, // current number of students
  maxOccupancy: { type: Number, default: 3 },
  size: { type: Number, default: 0 }, // current number of users assigned
  facilities: { type: [String], default: ["AC", "WiFi", "Study Table"] },
  contact: {
    warden: { type: String, default: "Dr. Rajesh Kumar" },
    assistantWarden: { type: String, default: "Mr. Suresh Babu" },
    emergencyContact: { type: String, default: "+91 98765 43210" },
    officeHours: { type: String, default: "9 AM - 6 PM" },
  },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], 
  joiningDate: { type: Date, default: Date.now },
}, { timestamps: true });

// Middleware to update 'size' automatically based on users array
roomSchema.pre('save', function(next) {
  this.size = this.users.length;
  this.occupancy = this.users.length;
  next();
});

export default mongoose.models.Room || mongoose.model("Room", roomSchema);

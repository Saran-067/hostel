import express from "express";
import Room from "../models/Room.js";
import auth from "../middleware/auth.js"; // your auth middleware

const router = express.Router();

// GET /api/room/my
// Get room details for logged-in user
router.get("/my", auth, async (req, res) => {
  try {
    // Find room where this user is assigned
    const room = await Room.findOne({ users: req.user.id });

    if (!room) {
      return res.status(200).json({
        success: true,
        data: null, // frontend will handle "No room allocated"
      });
    }

    // Construct response
    const roomDetails = {
      accommodationInfo: {
        hostelName: room.hostelName,
        block: room.block,
        roomNumber: room.roomNumber,
        floor: room.floor,
        roomType: room.roomType,
        joiningDate: room.joiningDate,
      },
      roomFeatures: {
        occupancy: room.occupancy,
        maxOccupancy: room.maxOccupancy,
        roomSize: "Standard",
        facilities: ["AC", "WiFi", "Study Table"],
        bathroom: "Attached",
      },
      contactInfo: {
        warden: "Dr. Rajesh Kumar",
        assistantWarden: "Mr. Suresh Babu",
        emergencyContact: "+91 98765 43210",
        officeHours: "9 AM - 6 PM",
      },
      roomStatus: {
        status: "Active",
      },
    };

    return res.status(200).json({ success: true, data: roomDetails });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
});

export default router;

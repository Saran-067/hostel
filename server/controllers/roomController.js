const Room = require("../models/Room");
const User = require("../models/User");
exports.createRoom = async (req, res) => {
  const { roomNumber, hostelBlock, capacity } = req.body;

  try {
    const exists = await Room.findOne({ roomNumber, hostelBlock });
    if (exists) return res.status(400).json({ error: "Room already exists" });

    const beds = Array.from({ length: capacity }, (_, i) => ({
      bedNumber: i + 1,
      student: null
    }));

    const room = await Room.create({ roomNumber, hostelBlock, capacity, beds });
    res.status(201).json({ message: "Room created successfully", room });
  } catch (err) {
    res.status(500).json({ error: "Failed to create room" });
  }
};
// Allocate room to student

exports.allocateRoom = async (req, res) => {
  const { studentId, roomNumber } = req.body;

  try {
    const room = await Room.findOne({ roomNumber });

    if (!room) return res.status(404).json({ error: "Room not found" });

    // Check if student is already assigned to any bed in this room
    const alreadyAllocated = room.beds.some(bed => String(bed.student) === studentId);
    if (alreadyAllocated)
      return res.status(400).json({ error: "Student already allocated in this room" });

    // Find first available bed
    const freeBed = room.beds.find(bed => bed.student === null);
    if (!freeBed)
      return res.status(400).json({ error: "No free beds available in this room" });

    // Allocate student to bed
    freeBed.student = studentId;
    room.occupied += 1;

    await room.save();

    res.json({ message: "Room allocated successfully", room });
  } catch (err) {
    console.error("Error allocating room:", err);
    res.status(500).json({ error: "Room allocation failed" });
  }
};

// View room details for the logged-in student
exports.getMyRoom = async (req, res) => {
  const studentId = req.user.id;

  try {
    const room = await Room.findOne({ occupants: studentId });
    if (!room) return res.status(404).json({ error: "No room assigned" });

    res.json(room);
  } catch (err) {
    // console.error("Error fetching room:", err);
    res.status(500).json({ error: "Failed to fetch room" });
  }
};

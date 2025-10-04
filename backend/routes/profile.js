import express from "express"
import auth from "../middleware/auth.js"
import User from "../models/User.js"
import Room from "../models/Room.js"
const router = express.Router()

// GET personal info
router.get("/personal", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password")
    if (!user) return res.status(404).json({ message: "User not found" })

    res.json({
      fullname: `${user.firstName} ${user.lastName}`,
      studentId: user.studentId,
      email: user.email,
      phone: user.phone,
      department: user.department,
      year: user.year,
      profilePhoto: user.profilePhoto || null,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// GET hostel info
router.post("/update", auth, async (req, res) => {
  try {
    const { block, floor, roomNo, roomType, joiningDate, size } = req.body;

    if (!block || !floor || !roomNo || !roomType || !joiningDate) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Find room that user is assigned to, or create a new room if not
    let room = await Room.findOne({ users: req.user._id });

    if (!room) {
      room = new Room({
        hostel: "PSG MAIN",
        block,
        floor,
        roomNo,
        roomType,
        joiningDate,
        users: [req.user._id],
      });
    } else {
      // Update existing room
      if (room.users.length < room.maxOccupancy && !room.users.includes(req.user._id)) {
        room.users.push(req.user._id);
      }
      room.block = block;
      room.floor = floor;
      room.roomNo = roomNo;
      room.roomType = roomType;
      room.joiningDate = new Date(joiningDate);
    }

    await room.save();

    res.json(room);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update room" });
  }
});

// GET financial info
router.get("/financial", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    res.json(user.financial)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

// POST deposit
router.post("/deposit", auth, async (req, res) => {
  try {
    const { amount } = req.body
    if (!amount || amount <= 0) return res.status(400).json({ message: "Invalid deposit amount" })

    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: "User not found" })

    // Update deposit and balance
    user.financial.deposit = (user.financial.deposit || 0) + amount
    user.financial.balance = (user.financial.balance || 0) + amount

    await user.save()

    res.json({
      financial: user.financial, // send updated financial info
      message: "Deposit successful",
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Internal Server Error" })
  }
})

export default router

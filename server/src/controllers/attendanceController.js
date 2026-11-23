const Attendance = require("../models/Attendance");
const Trainee = require("../models/Trainee");

const createAttendance = async (req, res) => {
  try {
    const {
      traineeId,
      date,
      status,
      markedBy,
    } = req.body;

    if (!traineeId || !date || !status) {
      return res.status(400).json({
        message:
          "traineeId, date and status are required",
      });
    }

    if (!["PRESENT", "ABSENT"].includes(status)) {
      return res.status(400).json({
        message: "Invalid attendance status",
      });
    }

    const trainee = await Trainee.findById(traineeId);

    if (!trainee) {
      return res.status(404).json({
        message: "Trainee not found",
      });
    }

    const attendance = await Attendance.create({
      traineeId,
      date,
      status,
      markedBy: markedBy || "",
    });

    const records = await Attendance.find({
      traineeId,
    });

    const presentCount = records.filter(
      (record) => record.status === "PRESENT"
    ).length;

    const attendancePercentage =
      records.length > 0
        ? (presentCount / records.length) * 100
        : 0;

    trainee.attendancePercentage =
      Number(attendancePercentage.toFixed(2));

    await trainee.save();

    res.status(201).json({
      message: "Attendance recorded successfully",
      attendance,
      attendancePercentage:
        trainee.attendancePercentage,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to record attendance",
    });
  }
};

const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate("traineeId", "name email")
      .sort({ date: -1 });

    res.json({
      attendance,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch attendance",
    });
  }
};

module.exports = {
  createAttendance,
  getAttendance,
};
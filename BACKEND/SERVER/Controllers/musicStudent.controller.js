// controllers/musicStudent.controller.js
import MusicStudent from '../Models/MusicStudent.js';
import Attendance from '../Models/Attendance.js';

export const addMusicStudent = async (req, res) => {
  try {
    const { rollNumber, name, course } = req.body;
    const exists = await MusicStudent.findOne({ rollNumber });
    if (exists) {
      return res.status(400).json({ message: 'Student already exists' });
    }

    const student = new MusicStudent({ rollNumber, name, course });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMusicStudents = async (req, res) => {
  try {
    const students = await MusicStudent.find().sort({ rollNumber: 1 });
    res.status(200).json(students); // ✅ returns array directly
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteMusicStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await MusicStudent.findByIdAndDelete(id);
    res.status(200).json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const updateMusicStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { rollNumber, name, course } = req.body;

    const updated = await MusicStudent.findByIdAndUpdate(
      id,
      { rollNumber, name, course },
      { new: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { rollNumber, date, present } = req.body;

    const existing = await Attendance.findOne({ rollNumber, date });
    if (existing) {
      existing.present = present;
      await existing.save();
      return res.status(200).json({ message: 'Attendance updated' });
    }

    const attendance = new Attendance({ rollNumber, date, present });
    await attendance.save();
    res.status(201).json({ message: 'Attendance marked' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAttendanceRecords = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const records = await Attendance.find({ rollNumber });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

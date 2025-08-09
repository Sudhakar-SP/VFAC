import express from 'express';
import Student from '../Models/Student.js';

const router = express.Router();

// Add new student
router.post('/', async (req, res) => {
  try {
    const { rollNumber, name, course } = req.body;
    const student = new Student({ rollNumber, name, course });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: 'Error adding student', error: err.message });
  }
});

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students' });
  }
});

// Search by roll number
router.get('/search/:roll', async (req, res) => {
  try {
    const student = await Student.findOne({ rollNumber: req.params.roll.toUpperCase() });
    if (!student) return res.status(404).json({ message: 'Not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Search error' });
  }
});

// Mark attendance
router.post('/attendance/:roll', async (req, res) => {
  try {
    const { date, present } = req.body;
    const student = await Student.findOne({ rollNumber: req.params.roll.toUpperCase() });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.attendance.push({ date, present });
    await student.save();

    res.json({ message: 'Attendance marked' });
  } catch (err) {
    res.status(500).json({ message: 'Attendance error' });
  }
});

export default router;

import express from 'express';
import {
  markAttendance,
  getAttendanceByDate,
  getAttendanceByDateRange,
  getAttendanceByStudent,
  getAllAttendance,
  getAttendancePercentage
} from '../Controllers/musicAttendance.controller.js';

const router = express.Router();

// GET routes
router.get('/', getAllAttendance);
router.get('/by-date', getAttendanceByDate);  // Uses query params
router.get('/date-range', getAttendanceByDateRange);  // Uses query params
router.get('/student/:rollNumber', getAttendanceByStudent);
router.get('/percentage', getAttendancePercentage);

// POST routes
router.post('/', markAttendance);

export default router;

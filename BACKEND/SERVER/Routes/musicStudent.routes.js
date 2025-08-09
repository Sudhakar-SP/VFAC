// routes/musicStudent.routes.js
import express from 'express';
import {
  addMusicStudent,
  getMusicStudents,
  deleteMusicStudent,
  updateMusicStudent,
  markAttendance,
  getAttendanceRecords,
} from '../Controllers/musicStudent.controller.js';

const router = express.Router();

router.post('/add', addMusicStudent);
router.get('/', getMusicStudents);
router.put('/update/:id', updateMusicStudent);
router.delete('/delete/:id', deleteMusicStudent);

router.post('/attendance', markAttendance);
router.get('/attendance/:rollNumber', getAttendanceRecords);

export default router;

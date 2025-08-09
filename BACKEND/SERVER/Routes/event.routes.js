import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  applyToEvent,
  getAppliedStudents,
  updateStudentStatus
} from '../Controllers/event.controller.js';

const router = express.Router();

// ✅ Logger Middleware
router.use((req, res, next) => {
  console.log(`🔥 [${req.method}] ${req.originalUrl}`);
  next();
});

// ✅ Multer Setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ ROUTES ORDERED CORRECTLY

// Create Event
router.post('/', upload.single('image'), createEvent);

// Get All Events
router.get('/', getAllEvents);

// Apply to Event
router.post('/apply/:id', applyToEvent);

// Get Applied Students
router.get('/applied/:id', getAppliedStudents);

// Update Student Status
router.put('/update-status/:eventId/:studentId', updateStudentStatus);

// Get, Update, Delete Event by ID
router.get('/:id', getEventById);
router.put('/:id', upload.single('image'), updateEvent);
router.delete('/:id', deleteEvent);

export default router;

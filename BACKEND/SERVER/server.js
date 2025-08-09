import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// Route Imports
import authRoutes from './Routes/auth.routes.js';
import eventRoutes from './Routes/event.routes.js';
import studentRoutes from './Routes/student.routes.js';
import musicStudentRoutes from './Routes/musicstudent.routes.js';
import musicAttendanceRoutes from './Routes/musicAttendance.routes.js';
import userRoutes from './Routes/user.routes.js';
import forgotRoutes from './Routes/forgotPassword.routes.js';
import galleryRoutes from './Routes/gallery.routes.js';
import applyRoutes from './Routes/applyRoutes.js';

 // ✅ This line registers the /api/apply/:eventId route


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/music-students', musicStudentRoutes);
app.use('/api/music-attendance', musicAttendanceRoutes);
app.use('/api/users', userRoutes);
app.use('/api/forgot', forgotRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api', applyRoutes);

// Root
app.get('/', (req, res) => res.send('✅ VFAC.COM Backend Running'));

// MongoDB + Server
mongoose
  .connect(process.env.URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log('✅ Connected to MongoDB');
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
  });

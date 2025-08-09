// routes/gallery.routes.js
import express from 'express';
import upload from '../Middleware/multer.js'; // ✅ Using centralized multer config
import {
  uploadMedia,
  getAllMedia,
  deleteMedia
} from '../Controllers/gallery.controller.js';

const router = express.Router();

// ✅ POST /api/gallery/upload — Upload media (image or video)
router.post('/upload', upload.single('file'), uploadMedia);

// ✅ GET /api/gallery/media — Get all uploaded media
router.get('/media', getAllMedia);

// ✅ DELETE /api/gallery/:id — Delete media by ID
router.delete('/:id', deleteMedia);

export default router;

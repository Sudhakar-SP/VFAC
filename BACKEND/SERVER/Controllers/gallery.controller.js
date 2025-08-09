// server/Controllers/gallery.controller.js
import fs from 'fs';
import path from 'path';
import Gallery from '../Models/Gallery.js';

const mediaDirectory = path.join(process.cwd(), 'uploads');

export const uploadMedia = async (req, res) => {
  console.log('Received file:', req.file);
  console.log('Request body:', req.body);
  try {
    if (!req.file || !req.body.name) {
      return res.status(400).json({ message: 'File and name are required' });
    }

    const mime = req.file.mimetype;
    const mediaType = mime.startsWith('image')
      ? 'photo'
      : mime.startsWith('video')
      ? 'video'
      : 'unknown';

    if (mediaType === 'unknown') {
      return res.status(400).json({ message: 'Unsupported file type' });
    }

    const newMedia = new Gallery({
      title: req.body.name,
      filename: req.file.filename,
      path: `/uploads/${req.file.filename}`,
      mimetype: mime,
      mediaType,
    });
console.log('New media object:', newMedia);
    console.log('Saving media to database...');
    await newMedia.save();
    res.status(200).json({ message: 'Upload successful', media: newMedia });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Server error during upload' });
  }
};

export const getAllMedia = async (req, res) => {
  try {
    const mediaList = await Gallery.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: mediaList.length,
      media: mediaList,
    });
  } catch (error) {
    console.error('❌ Error fetching media:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching media',
    });
  }
};

export const deleteMedia = async (req, res) => {
  try {
    const media = await Gallery.findById(req.params.id);
    if (!media) return res.status(404).json({ message: 'Media not found' });

    const filePath = path.join('uploads', path.basename(media.path));
    fs.unlink(filePath, (err) => {
      if (err) console.error('File delete error:', err);
    });

    await Gallery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Media deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting media' });
  }
};

import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    mimetype: { type: String, required: true },
    mediaType: {
      type: String,
      enum: ['photo', 'video'],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Gallery', gallerySchema);
      
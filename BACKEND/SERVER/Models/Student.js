import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    enum: ['UG', 'PG'],
    required: true
  },
  isMember: {
    type: Boolean,
    default: false
  },
  attendance: [
    {
      date: { type: Date, required: true },
      present: { type: Boolean, default: true }
    }
  ]
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);

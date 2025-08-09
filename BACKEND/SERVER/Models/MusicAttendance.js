import mongoose from 'mongoose';

const MusicAttendanceSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      default: Date.now,
      unique: true,
    },
    presentStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MusicStudent',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('MusicAttendance', MusicAttendanceSchema);

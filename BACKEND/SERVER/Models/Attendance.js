import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true,
  },
  attendance: [
    {
      student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MusicStudent',
        required: true,
      },
      rollNumber: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        enum: ['present', 'absent'],
        default: 'absent',
      },
    },
  ],
});

export default mongoose.model('Attendance', attendanceSchema);

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
  rollNumber: { type: String, unique: true, sparse: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['student', 'staff', 'admin'], default: 'student' },
  staffType: {
    type: String,
    enum: ['music', 'internal', 'external'],
    required: function () { return this.role === 'staff'; }
  },
  isMember: { type: Boolean, default: false },
  mobile: { type: String, trim: true, sparse: true },
  otp: {
    code: String,
    expiresAt: Date,
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);

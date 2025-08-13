import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },       // <-- Added venue field here
  description: String,
  image: { type: String, required: true },
  applicants: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    appliedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' }
  }]
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);

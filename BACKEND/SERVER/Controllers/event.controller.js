import mongoose from 'mongoose';
import Event from '../Models/Event.js';
import User from '../Models/User.js';

// Create a new event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date, venue } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    if (!venue) {
      return res.status(400).json({ message: 'Venue is required' });
    }

    const newEvent = new Event({
      title,
      description,
      date,
      venue,
      image: req.file.filename,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error while creating event' });
  }
};

// Get all events sorted by creation date descending
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};

// Get a single event by ID
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json(event);
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching event' });
  }
};

// Update event by ID
export const updateEvent = async (req, res) => {
  try {
    const { title, description, date, venue } = req.body;

    // Build update object
    const updateData = { title, description, date, venue };
    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true, // Enforce schema validation on update
    });

    if (!updatedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error while updating event' });
  }
};

// Delete event by ID
export const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error while deleting event' });
  }
};

// Apply or cancel application to an event
export const applyToEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { studentId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(eventId) || !mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ message: 'Invalid eventId or studentId' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const existingIndex = event.applicants.findIndex(
      (applicant) => applicant.user.toString() === studentId
    );

    if (existingIndex !== -1) {
      // Cancel application
      event.applicants.splice(existingIndex, 1);
      await event.save();
      return res.status(200).json({ message: 'Application cancelled successfully' });
    } else {
      // Apply to event with default status 'Pending'
      event.applicants.push({ user: studentId, status: 'Pending' });
      await event.save();
      return res.status(200).json({ message: 'Successfully applied to the event' });
    }
  } catch (error) {
    console.error('Apply to event error:', error);
    res.status(500).json({ message: 'Server error while applying to event' });
  }
};

// Get list of applied students for a specific event with populated user info
export const getAppliedStudents = async (req, res) => {
  try {
    const eventId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid eventId' });
    }

    const event = await Event.findById(eventId)
      .populate('applicants.user', 'username rollNumber isMember')
      .lean();

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({
      _id: event._id,
      title: event.title,
      description: event.description,
      date: event.date,
      venue: event.venue,
      image: event.image,
      applicants: event.applicants,
    });
  } catch (error) {
    console.error('Get applied students error:', error);
    res.status(500).json({ message: 'Server error while fetching applicants' });
  }
};

// Update student application status for an event
export const updateStudentStatus = async (req, res) => {
  try {
    const { eventId, studentId } = req.params;
    const { status } = req.body;

    if (
      !mongoose.Types.ObjectId.isValid(eventId) ||
      !mongoose.Types.ObjectId.isValid(studentId)
    ) {
      return res.status(400).json({ message: 'Invalid eventId or studentId' });
    }

    const allowedStatuses = ['Accepted', 'Rejected', 'Pending'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Update status in applicants array
    const updateResult = await Event.updateOne(
      { _id: eventId, 'applicants.user': studentId },
      { $set: { 'applicants.$.status': status } }
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ message: 'Applicant not found for this event' });
    }

    // Update user's isMember flag depending on status
    await User.findByIdAndUpdate(studentId, { isMember: status === 'Accepted' });

    res.status(200).json({ message: `Status updated to ${status}` });
  } catch (error) {
    console.error('Update student status error:', error);
    res.status(500).json({ message: 'Internal server error while updating status' });
  }
};

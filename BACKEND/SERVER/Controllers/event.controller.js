import Event from '../Models/Event.js';
import User from '../Models/User.js';
import mongoose from 'mongoose';

// Create Event
export const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    if (!req.file) return res.status(400).json({ message: 'Image is required' });

    const newEvent = new Event({
      title,
      description,
      date,
      image: req.file.filename,
    });

    await newEvent.save();
    res.status(201).json({ message: 'Event created successfully', event: newEvent });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error while creating event' });
  }
};

// Get All Events
export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error while fetching events' });
  }
};

// Get Single Event
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json(event);
  } catch (error) {
    console.error('Get event by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching event' });
  }
};

// Update Event
export const updateEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const updateData = { title, description, date };

    if (req.file) updateData.image = req.file.filename;

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Server error while updating event' });
  }
};

// Delete Event
export const deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error while deleting event' });
  }
};

// Apply / Cancel Application to Event
export const applyToEvent = async (req, res) => {
  try {
    const eventId = req.params.id;
    const { studentId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const existingIndex = event.applicants.findIndex(
      (applicant) => applicant.user.toString() === studentId
    );

    if (existingIndex !== -1) {
      event.applicants.splice(existingIndex, 1);
      await event.save();
      return res.status(200).json({ message: 'Application cancelled successfully' });
    } else {
      event.applicants.push({ user: studentId });
      await event.save();
      return res.status(200).json({ message: 'Successfully applied to the event' });
    }
  } catch (err) {
    console.error('Apply error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Applied Students
export const getAppliedStudents = async (req, res) => {
  try {
    const eventId = req.params.id;
    console.log("🔍 Fetching event ID:", eventId);

    const event = await Event.findById(eventId)
      .populate('applicants.user', 'username rollNumber isMember')
      .lean(); // Makes it plain JS object

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event); // ✅ Send full event
  } catch (error) {
    console.error("❌ Error in getAppliedStudents:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
};



// Update Student Status
export const updateStudentStatus = async (req, res) => {
  try {
    const { eventId, studentId } = req.params;
    const { status } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const applicant = event.applicants.find(
      (app) => app.user.toString() === studentId
    );

    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found' });
    }

    applicant.status = status;
    applicant.member = status === "Accepted" ? "Yes" : "No";

    await event.save();

    res.status(200).json({ message: `Status updated to ${status}` });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

import Event from '../Models/Event.js';
//import { FaUserPlus, FaUsers, FaList } from 'react-icons/fa';

export const applyToEvent = async (req, res) => {
  const { eventId } = req.params;
  const { studentId } = req.body;

  if (!eventId || !studentId) {
    return res.status(400).json({ error: "Missing eventId or studentId" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const alreadyApplied = event.applicants.some(
      (applicant) => applicant.studentId === studentId
    );

    if (!alreadyApplied) {
      event.applicants.push({ studentId });
      await event.save();
    }

    res.status(200).json({ message: "Successfully applied to event" });
  } catch (error) {
    console.error("Apply error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const removeApplication = async (req, res) => {
  const { eventId } = req.params;
  const { studentId } = req.body;

  if (!eventId || !studentId) {
    return res.status(400).json({ error: "Missing eventId or studentId" });
  }

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    event.applicants = event.applicants.filter(
      (a) => a.studentId !== studentId
    );

    await event.save();

    res.status(200).json({ message: "Application removed successfully" });
  } catch (err) {
    console.error("Remove error:", err);
    res.status(500).json({ error: "Failed to remove application" });
  }
};


// export const getAppliedStudents = async (req, res) => {
//   try {
//     const events = await Event.find().populate({
//       path: 'appliedStudents',
//       select: 'rollNumber username status' // customize as needed
//     });

//     const formatted = events.map(event => ({
//       eventId: event._id,
//       eventTitle: event.title,
//       students: event.appliedStudents.map((student, index) => ({
//         sNo: index + 1,
//         rollNumber: student.rollNumber,
//         name: student.username,
//         status: student.status || 'Pending', // adjust if you have status per application
//       }))
//     }));

//     res.status(200).json(formatted);
//   } catch (error) {
//     console.error("Error fetching applied students:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

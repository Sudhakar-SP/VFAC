import Attendance from '../Models/Attendance.js';
import MusicStudent from '../Models/MusicStudent.js';

// Helper: Validate attendance array format
const validateAttendanceArray = (attendance) => {
  if (!Array.isArray(attendance)) return false;
  for (const entry of attendance) {
    if (
      !entry.student || // changed from studentId to student to match your DB schema
      typeof entry.rollNumber !== 'string' ||
      !['present', 'absent'].includes(entry.status)
    ) {
      return false;
    }
  }
  return true;
};

// ✅ MARK ATTENDANCE
export const markAttendance = async (req, res) => {
  try {
    const { date, attendance } = req.body;

    if (!date || !validateAttendanceArray(attendance)) {
      return res.status(400).json({ message: 'Invalid attendance data format' });
    }

    const formattedAttendance = attendance.map(record => ({
      student: record.student,
      rollNumber: record.rollNumber,
      status: record.status || 'absent'
    }));

    const result = await Attendance.findOneAndUpdate(
      { date: new Date(date) },
      {
        date: new Date(date),
        attendance: formattedAttendance
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    ).populate('attendance.student', 'rollNumber name');

    res.status(200).json({
      message: 'Attendance marked successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to mark attendance',
      error: error.message
    });
  }
};

// ✅ UPDATE ATTENDANCE
export const updateAttendance = async (req, res) => {
  try {
    const { date, attendance } = req.body;

    if (!date || !validateAttendanceArray(attendance)) {
      return res.status(400).json({ message: 'Invalid attendance data format' });
    }

    const existingRecord = await Attendance.findOne({ date: new Date(date) });
    if (!existingRecord) {
      return res.status(404).json({ message: 'Attendance record not found for this date' });
    }

    // Update statuses only for matching rollNumbers
    const updatedAttendance = existingRecord.attendance.map(existingEntry => {
      const updatedEntry = attendance.find(a => a.rollNumber === existingEntry.rollNumber);
      if (
          !entry.student || // student is required (must be truthy)
          typeof entry.rollNumber !== 'string' || // rollNumber must be string
          !['present', 'absent'].includes(entry.status)
        ) {
          return false;
        }
      return existingEntry;
    });

    existingRecord.attendance = updatedAttendance;
    const savedRecord = await existingRecord.save();

    res.status(200).json({
      message: 'Attendance updated successfully',
      data: savedRecord
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update attendance',
      error: error.message
    });
  }
};

// ✅ GET ATTENDANCE BY DATE
export const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const selectedDate = new Date(date);
    selectedDate.setUTCHours(0, 0, 0, 0);

    const nextDay = new Date(selectedDate);
    nextDay.setUTCDate(selectedDate.getUTCDate() + 1);

    const attendanceRecord = await Attendance.findOne({
      date: { $gte: selectedDate, $lt: nextDay }
    });

    if (!attendanceRecord) {
      return res.status(200).json({ message: 'No attendance record found', attendance: [] });
    }

    const studentMap = {};
    const students = await MusicStudent.find();
    students.forEach(s => {
      studentMap[s.rollNumber] = {
        _id: s._id,
        rollNumber: s.rollNumber,
        name: s.name,
        course: s.course
      };
    });

    const detailedAttendance = attendanceRecord.attendance.map(entry => {
      const student = studentMap[entry.rollNumber];
      return {
        studentId: student?._id || null,
        rollNumber: entry.rollNumber,
        name: student?.name || 'Unknown',
        course: student?.course || '',
        status: entry.status
      };
    });

    res.status(200).json({ attendance: detailedAttendance });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ✅ GET ATTENDANCE BY STUDENT
export const getAttendanceByStudent = async (req, res) => {
  try {
    const { rollNumber } = req.params;
    const records = await Attendance.find({ 'attendance.rollNumber': rollNumber }).lean();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance', error: error.message });
  }
};

// ✅ GET ALL ATTENDANCE
export const getAllAttendance = async (req, res) => {
  try {
    const { date } = req.query;
    let query = {};

    if (date) {
      const searchDate = new Date(date);
      searchDate.setHours(0, 0, 0, 0);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      query.date = { $gte: searchDate, $lt: nextDay };
    }

    const records = await Attendance.find(query)
      .sort({ date: -1 })
      .populate('attendance.student', 'rollNumber name')
      .lean();

    const validRecords = records
      .filter(record => record && record.date)
      .map(record => {
        const validAttendance = Array.isArray(record.attendance)
          ? record.attendance.map(att => ({
              student: att.student || null,
              rollNumber: att.rollNumber || 'UNKNOWN',
              status: att.status || 'absent'
            }))
          : [];

        return {
          _id: record._id,
          date: record.date,
          attendance: validAttendance
        };
      });

    return res.status(200).json(validRecords);
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching attendance records',
      error: error.message
    });
  }
};

// ✅ GET ATTENDANCE BY DATE RANGE
export const getAttendanceByDateRange = async (req, res) => {
  try {
    const { startDate, endDate, rollNumber } = req.query;

    let query = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (rollNumber) {
      query['attendance.rollNumber'] = rollNumber;
    }

    const records = await Attendance.find(query)
      .sort({ date: 1 })
      .populate('attendance.student', 'rollNumber name')
      .lean();

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance records', error: error.message });
  }
};

// ✅ GET ATTENDANCE PERCENTAGE
export const getAttendancePercentage = async (req, res) => {
  try {
    const { rollNumber, date } = req.query;

    if (!rollNumber || !date) {
      return res.status(400).json({ message: 'Roll number and date are required' });
    }

    const monthStart = new Date(date);
    monthStart.setDate(1);
    const monthEnd = new Date(date);
    monthEnd.setMonth(monthEnd.getMonth() + 1, 0);

    const records = await Attendance.find({
      date: { $gte: monthStart, $lte: monthEnd },
      'attendance.rollNumber': rollNumber
    }).lean();

    const totalDays = records.length;
    const presentDays = records.filter(record =>
      record.attendance.some(a =>
        a.rollNumber === rollNumber && a.status === 'present'
      )
    ).length;

    const percentage = totalDays ? (presentDays / totalDays) * 100 : 0;

    res.json({
      percentage: percentage.toFixed(2),
      totalDays,
      presentDays
    });

  } catch (error) {
    res.status(500).json({ message: 'Error calculating attendance percentage', error: error.message });
  }
};

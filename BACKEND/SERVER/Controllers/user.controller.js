import User from '../Models/User.js';

// ✅ Approve membership
export const approveMembership = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isMember: true },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Membership approved", user });
  } catch (err) {
    console.error("Error approving membership:", err);
    res.status(500).json({ error: "Failed to approve membership" });
  }
};

// ✅ Remove membership
export const removeMembership = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isMember: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Membership removed", user });
  } catch (err) {
    console.error("Error removing membership:", err);
    res.status(500).json({ error: "Failed to remove membership" });
  }
};

// ✅ Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await User.find({ role: 'student' });
    res.status(200).json(students);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
};

// ✅ Get approved members only
export const getMembers = async (req, res) => {
  console.log('Fetching approved members...');
  try {
    const members = await User.find(
      { role: 'student', isMember: true },
      'username rollNumber' // Select only these fields
    );
    res.status(200).json(members);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ message: 'Failed to fetch members' });
  }
};




// ✅ List users by role (summary)
export const listUsers = async (req, res) => {
  try {
    const allStaff = await User.find({ role: 'staff' });
    const students = await User.find({ role: 'student' });

    const internalStaff = allStaff.filter((user) =>
      user.email?.endsWith('@vivekanandacollege.ac.in')
    );

    const externalStaff = allStaff.filter((user) =>
      user.email && !user.email.endsWith('@vivekanandacollege.ac.in')
    );

    res.status(200).json({ students, internalStaff, externalStaff });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ message: 'Failed to list users.' });
  }
};

// ✅ Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const getStudentProfile = async (req, res) => {
  try {
    const userId = req.user._id; // Now req.user is populated by requireAuth
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error('Get student profile error:', err);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
};


// ✏️ Optional: Update student profile (name, email, course)
export const updateStudentProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, course } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, course },
      { new: true, runValidators: true, select: '-password' }
    );

    if (!updatedUser) return res.status(404).json({ error: 'Student not found' });

    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating student profile:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

import User from "../Models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Signup
export const signup = async (req, res) => {
  const { username, password, role, rollNumber, email, staffType } = req.body;
  console.log("Signup request:", req.body);
  try {
    const query = role === "student"
      ? { rollNumber: rollNumber?.toLowerCase() }
      : { email };

    const existing = await User.findOne(query);
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // const user = new User({
    //   username,
    //   password: hashed,
    //   role,
    //   email: role !== "student" ?  email?.toLowerCase()  : undefined,
    //   rollNumber: role === "student" ? rollNumber?.toLowerCase() : undefined,
    //   staffType: role === "staff" ? staffType : undefined,
    // });

    const user = new User({
      username,
      password: hashed,
      role,
      email: email?.toLowerCase(),
      rollNumber: role === "student" ? rollNumber?.toLowerCase() : undefined,
      staffType: role === "staff" ? staffType : undefined,
    });

    console.log("User object before saving:", user);
    await user.save();
    res.status(201).json({ message: "Signup successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed" });
  }
};

// ✅ Login
// export const login = async (req, res) => {
//   const { identifier, password, role } = req.body;
//   console.log("Login request:", req.body);

//   try {
//     const query = identifier.includes("@")
//       ? { email: identifier }
//       : { rollNumber: identifier.toLowerCase() };

//     const user = await User.findOne(query);
//     if (!user) {
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     // ✅ Prevent logging in with wrong role
//     if (role && user.role !== role) {
//       return res.status(403).json({ error: `You are not authorized to login as ${role}` });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: "Invalid credentials" });
//     }

//     const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
//       expiresIn: "1d",
//     });

//     res.cookie("token", token, {
//       httpOnly: true,
//       sameSite: "strict",
//       secure: process.env.NODE_ENV === "production",
//       maxAge: 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         username: user.username,
//         role: user.role,
//         isMember: user.isMember || false,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: "Login failed" });
//   }
// };
export const login = async (req, res) => {
  const { email, rollNumber, password, role } = req.body;
  console.log("Login request:", req.body);

  try {
    if (!password || (!email && !rollNumber)) {
      return res.status(400).json({ error: "Missing credentials" });
    }

    const query = email
      ? { email: email.toLowerCase() }
      : { rollNumber: rollNumber.toLowerCase() };

    const user = await User.findOne(query);

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // ✅ Extended role validation
    if (role === 'external-staff' && (user.role !== 'staff' || user.staffType !== 'external')) {
      return res.status(403).json({ error: "You are not authorized to login as external-staff" });
    }

    if (role === 'internal-staff' && (user.role !== 'staff' || user.staffType !== 'internal')) {
      return res.status(403).json({ error: "You are not authorized to login as internal-staff" });
    }

    if ((role === 'admin' || role === 'student') && user.role !== role) {
      return res.status(403).json({ error: `You are not authorized to login as ${role}` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        staffType: user.staffType,
        isMember: user.isMember || false,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};





// ✅ Logout
export const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// ✅ Approve Member
export const approveMember = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isMember = true;
    await user.save();

    res.status(200).json({ message: "User approved as member" });
  } catch (err) {
    console.error("Approve error:", err);
    res.status(500).json({ error: "Approval failed" });
  }
};

// ✅ Reject Member
export const rejectMember = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.isMember = false;
    await user.save();

    res.status(200).json({ message: "Member rejected successfully", user });
  } catch (err) {
    console.error("Reject member error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Admin Stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const pendingMembers = await User.countDocuments({ role: "club", isMember: false });
    const approvedMembers = await User.countDocuments({ role: "club", isMember: true });

    res.json({ totalUsers, pendingMembers, approvedMembers });
  } catch (err) {
    console.error("Stats fetch error:", err);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
};
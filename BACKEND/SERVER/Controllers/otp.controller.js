import User from '../Models/User.js';
import otpGenerator from 'otp-generator';

// In-memory OTP store (use Redis or DB for production)
const otpStore = new Map();

export const sendOTP = async (req, res) => {
  const { mobile } = req.body;

  try {
    const user = await User.findOne({ role: 'admin', phone: mobile });

    if (!user) {
      return res.status(404).json({ message: 'Admin with this mobile number not found.' });
    }

    const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
    otpStore.set(mobile, otp);

    console.log(`🔐 OTP for ${mobile}: ${otp}`); // In production, send via SMS

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const resetPassword = async (req, res) => {
  const { mobile, otp, newPassword } = req.body;

  const storedOTP = otpStore.get(mobile);
  if (storedOTP !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  const user = await User.findOne({ phone: mobile, role: 'admin' });

  if (!user) {
    return res.status(404).json({ message: 'Admin not found' });
  }

  user.password = newPassword;
  await user.save();

  otpStore.delete(mobile);
  return res.status(200).json({ message: 'Password reset successful' });
};

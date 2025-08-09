import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import User from '../Models/User.js';
import bcrypt from 'bcryptjs';

// ✅ Create transporter using Gmail (App Password required)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,     // your Gmail email address
    pass: process.env.EMAIL_PASS      // your 16-digit Gmail app password
  },
});

// ✅ Send OTP to Admin Email
export const sendOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email is required' });

  try {
    const user = await User.findOne({ email, role: 'admin' });
    if (!user) return res.status(404).json({ message: 'Admin not found with this email' });

    // ✅ Generate 6-digit numeric OTP
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
      lowerCaseAlphabets: false,
      digits: true
    });

    // ✅ Store OTP in DB with expiration (5 mins)
    user.otp = {
      code: otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    };
    await user.save();

    // ✅ Send Email
    await transporter.sendMail({
      from: `"VFAC.COM Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'OTP for Password Reset - VFAC.COM',
      html: `
        <h2>Password Reset OTP</h2>
        <p>Your OTP code is:</p>
        <h1 style="color:#2e86de; font-size: 32px;">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      `,
    });

    console.log(`✅ OTP sent to ${email}: ${otp}`);
    res.status(200).json({
      message: 'OTP sent to your email',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined // Show OTP only in development
    });

  } catch (error) {
    console.error('❌ Error sending OTP:', error.message);
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

// ✅ Reset Password using OTP
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: 'Email, OTP, and new password are required' });
  }

  try {
    const user = await User.findOne({
      email,
      role: 'admin',
      'otp.code': otp,
      'otp.expiresAt': { $gt: new Date() } // check if not expired
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired OTP' });

    // ✅ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.otp = undefined; // clear OTP
    await user.save();

    console.log(`✅ Password reset successful for ${email}`);
    res.status(200).json({ message: 'Password reset successful' });

  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};

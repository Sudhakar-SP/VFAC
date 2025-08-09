import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./Models/User.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    const adminUser = new User({
      username: "admin",
      fullname: "Admin User",
      email: "admin@example.com",  // ✅ This email must match login
      password: hashedPassword,
      role: "admin"
    });

    await adminUser.save();
    console.log("✅ Admin created successfully");
    process.exit();
  })
  .catch((error) => {
    console.error("❌ Failed to create admin:", error);
    process.exit(1);
  });

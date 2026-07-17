import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../modules/users/user.model.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();
    const existingAdmin = await User.findOne({
      email: process.env.ADMIN_EMAIL,
    });
    if (existingAdmin) {
      console.log("Admin already registered");
      await mongoose.connection.close();
      process.exit(0);
    }
    const newAdmin = new User({
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: "ADMIN",
    });
    await newAdmin.save();
    console.log("Admin created successfully");
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedAdmin();

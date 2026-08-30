import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const updatePassword = async () => {
  try {
    const hashedPassword = bcrypt.hashSync('admin@#2222', 12);
    const admin = await Admin.findOne({ email: 'admin@swarnstree.com' });
    if (admin) {
      admin.password = hashedPassword;
      await admin.save();
      console.log('Password updated successfully to admin@#2222');
    } else {
      console.log('Admin not found!');
    }
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

updatePassword();

import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) return res.status(404).json({ success: false, message: 'Admin Not found.' });

    const passwordIsValid = bcrypt.compareSync(req.body.password, admin.password);
    if (!passwordIsValid) return res.status(401).json({ success: false, message: 'Invalid Password!' });

    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET || 'supersecret', { expiresIn: 86400 });
    res.status(200).json({ success: true, token, admin: { id: admin._id, name: admin.name, email: admin.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);

    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5);

    res.status(200).json({
      success: true,
      stats: { totalOrders, totalCustomers, totalProducts, totalRevenue },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

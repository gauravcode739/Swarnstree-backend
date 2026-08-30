import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const user = new User({ name, email, phone, password: hashedPassword });
    await user.save();
    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ success: false, message: 'User Not found.' });

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).json({ success: false, message: 'Invalid Password!' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'supersecret', { expiresIn: 86400 });
    res.status(200).json({ success: true, token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

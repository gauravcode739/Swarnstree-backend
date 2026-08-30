import Coupon from '../models/Coupon.js';

export const createCoupon = async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    const savedCoupon = await coupon.save();
    res.status(201).json({ success: true, data: savedCoupon });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.status(200).json({ success: true, data: coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

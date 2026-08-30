import Banner from '../models/Banner.js';

export const createBanner = async (req, res) => {
  try {
    const banner = new Banner(req.body);
    const savedBanner = await banner.save();
    res.status(201).json({ success: true, data: savedBanner });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true });
    res.status(200).json({ success: true, data: banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

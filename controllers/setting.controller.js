import Setting from '../models/Setting.js';

export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();
    if (!settings) {
      settings = new Setting();
    }
    
    const { globalFreeShippingThreshold, marqueeText, isMarqueeActive } = req.body;
    
    if (globalFreeShippingThreshold !== undefined) settings.globalFreeShippingThreshold = globalFreeShippingThreshold;
    if (marqueeText !== undefined) settings.marqueeText = marqueeText;
    if (isMarqueeActive !== undefined) settings.isMarqueeActive = isMarqueeActive;

    await settings.save();
    res.status(200).json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

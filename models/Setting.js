import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    globalFreeShippingThreshold: { type: Number, default: 0 }, // 0 means no global free shipping
    marqueeText: { type: String, default: 'Welcome to Swarnstree! ✦ Flat 10% OFF on Prepaid Orders ✦ Free Shipping Across India' },
    isMarqueeActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Setting = mongoose.model('Setting', settingSchema);
export default Setting;

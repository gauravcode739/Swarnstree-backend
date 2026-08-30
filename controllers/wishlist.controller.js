import Wishlist from '../models/Wishlist.js';

export const toggleWishlist = async (req, res) => {
  try {
    const { product } = req.body;
    let wishlist = await Wishlist.findOne({ user: req.userId });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.userId, products: [product] });
    } else {
      const index = wishlist.products.indexOf(product);
      if (index > -1) {
        wishlist.products.splice(index, 1); // Remove if exists
      } else {
        wishlist.products.push(product); // Add if not
      }
    }

    await wishlist.save();
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.userId }).populate('products');
    res.status(200).json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

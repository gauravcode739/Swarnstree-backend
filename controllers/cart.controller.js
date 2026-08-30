import Cart from '../models/Cart.js';

export const addToCart = async (req, res) => {
  try {
    const { product, quantity, price } = req.body;
    let cart = await Cart.findOne({ user: req.userId });
    
    if (!cart) {
      cart = new Cart({ user: req.userId, items: [{ product, quantity, price }], totalAmount: quantity * price });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === product);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product, quantity, price });
      }
      cart.totalAmount += quantity * price;
    }
    
    await cart.save();
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userId }).populate('items.product');
    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

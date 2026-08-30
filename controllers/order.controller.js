import Order from '../models/Order.js';
import { sendOrderStatusEmail } from '../utils/mailer.js';

export const createOrder = async (req, res) => {
  try {
    // req.userId from authJwt middleware if logged in, otherwise it's guest checkout
    const orderData = { ...req.body };
    if (req.userId) {
      orderData.user = req.userId;
    }
    const order = new Order(orderData);
    const savedOrder = await order.save();
    res.status(201).json({ success: true, data: savedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('products.product').populate('user', 'name email');
    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('products.product').populate('user', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { paymentStatus, orderStatus, paymentMethod } = req.body;
    const order = await Order.findById(req.params.id).populate('products.product').populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    
    let statusChanged = false;
    
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
      if (paymentStatus === 'Completed') {
        if (!order.isPaid) {
          order.isPaid = true;
          order.paidAt = Date.now();
        }
      } else {
        order.isPaid = false;
        order.paidAt = undefined;
      }
    }
    
    if (paymentMethod) {
      order.paymentMethod = paymentMethod;
    }
    
    if (orderStatus && order.orderStatus !== orderStatus) {
      order.orderStatus = orderStatus;
      statusChanged = true;
    }
    
    const updatedOrder = await order.save();
    
    // Trigger email notification in background if order status changed
    if (statusChanged) {
      sendOrderStatusEmail(updatedOrder, orderStatus).catch(err => console.error('Failed to send status email:', err));
    }
    
    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendOrderEmailManual = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate('products.product').populate('user', 'name email');
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    await sendOrderStatusEmail(order, status);
    res.status(200).json({ success: true, message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestDetails: {
      name: String,
      email: String,
      phone: String
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
      }
    ],
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String
    },
    shippingModel: { type: mongoose.Schema.Types.ObjectId, ref: 'Shipping' },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Pending'
    },
    paymentMethod: { type: String },
    payuTransactionId: { type: String }, // mihpayid
    paymentMode: { type: String }, // mode (e.g., UPI, CC, DC)
    paymentError: { type: String }, // error message if any
    payuResponse: { type: mongoose.Schema.Types.Mixed }, // raw response
    prepaidDiscount: { type: Number, default: 0 },
    orderStatus: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending'
    },
    couponApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
    totalAmount: { type: Number, required: true }
  },
  { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;

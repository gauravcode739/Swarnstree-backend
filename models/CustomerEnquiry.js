import mongoose from 'mongoose';

const customerEnquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // Optional
  },
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  message: {
    type: String,
    required: true,
  }
}, {
  timestamps: true
});

const CustomerEnquiry = mongoose.model('CustomerEnquiry', customerEnquirySchema);
export default CustomerEnquiry;

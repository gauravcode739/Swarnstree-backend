import CustomerEnquiry from '../models/CustomerEnquiry.js';

// @desc    Create a new customer enquiry
// @route   POST /api/v1/enquiries
// @access  Public
export const createEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !phone || !message) {
      return res.status(400).json({ success: false, message: 'Name, phone, and message are required fields' });
    }

    const enquiry = await CustomerEnquiry.create({
      name,
      email,
      phone,
      message
    });

    res.status(201).json({
      success: true,
      data: enquiry,
      message: 'Enquiry submitted successfully'
    });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({ success: false, message: error.message || 'Server Error' });
  }
};

// @desc    Get all enquiries
// @route   GET /api/v1/enquiries
// @access  Private/Admin
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await CustomerEnquiry.find({}).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: enquiries
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

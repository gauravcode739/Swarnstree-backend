import Review from '../models/Review.js';

export const createReview = async (req, res) => {
  try {
    const { product, rating, comment, reviewerName, isApproved, images } = req.body;
    
    // If admin is creating manually, they might provide reviewerName instead of being a logged-in User
    let reviewData = { product, rating, comment, images: images || [] };
    
    if (req.userRole === 'admin') {
      reviewData.reviewerName = reviewerName || 'Admin';
      reviewData.isApproved = isApproved !== undefined ? isApproved : true; // Admin reviews are approved by default
    } else {
      reviewData.user = req.userId;
      reviewData.isApproved = false; // User reviews need approval
    }

    const review = new Review(reviewData);
    const savedReview = await review.save();
    res.status(201).json({ success: true, data: savedReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    // Only return approved reviews for the public endpoint
    const reviews = await Review.find({ product: req.params.productId, isApproved: true }).populate('user', 'name');
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name')
      .populate('product', 'name sku')
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved, rating, comment, reviewerName } = req.body;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (isApproved !== undefined) review.isApproved = isApproved;
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (reviewerName !== undefined) review.reviewerName = reviewerName;

    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    await Review.findByIdAndDelete(id);
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

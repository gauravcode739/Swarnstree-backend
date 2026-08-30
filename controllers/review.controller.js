import Review from '../models/Review.js';

export const createReview = async (req, res) => {
  try {
    const { product, rating, comment, reviewerName, isApproved } = req.body || {};
    
    // Collect uploaded image URLs (from multipart upload)
    const uploadedImages = req.files && req.files.length > 0
      ? req.files.map(f => f.path)
      : [];

    let reviewData = { 
      product, 
      rating: Number(rating) || 5, 
      comment: comment || '', 
      images: uploadedImages 
    };
    
    if (req.userRole === 'admin' || reviewerName) {
      reviewData.reviewerName = reviewerName || 'Admin';
      reviewData.isApproved = isApproved !== undefined ? (isApproved === 'true' || isApproved === true) : true;
    } else {
      reviewData.user = req.userId;
      reviewData.isApproved = false;
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
    const { isApproved, rating, comment, reviewerName } = req.body || {};

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (isApproved !== undefined) review.isApproved = isApproved;
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;
    if (reviewerName !== undefined) review.reviewerName = reviewerName;

    // Handle image updates
    if (req.body.existingImages !== undefined) {
      // Admin sent back which existing images to keep
      try {
        review.images = JSON.parse(req.body.existingImages);
      } catch {
        review.images = [];
      }
    }
    if (req.files && req.files.length > 0) {
      const newImageUrls = req.files.map(f => f.path);
      review.images = [...(review.images || []), ...newImageUrls];
    }

    await review.save();
    res.json({ success: true, data: review });
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

import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if manually added by admin
    reviewerName: { type: String }, // For manual admin reviews
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    images: [{ type: String }],
    isApproved: { type: Boolean, default: false } // Admin approval
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', reviewSchema);
export default Review;

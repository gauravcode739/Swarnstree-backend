import mongoose from 'mongoose';

const subCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }
  },
  { timestamps: true }
);

// Optional: ensure unique name within a category
subCategorySchema.index({ name: 1, category: 1 }, { unique: true });

const SubCategory = mongoose.model('SubCategory', subCategorySchema);
export default SubCategory;

import Category from '../models/Category.js';

export const createCategory = async (req, res) => {
  try {
    const { name, isFeatured } = req.body;
    let image = req.body.image; // Fallback if they somehow sent a text URL
    if (req.file) {
      image = req.file.path; // Cloudinary secure URL
    }

    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const newCategory = new Category({
      name,
      image,
      isFeatured: isFeatured === 'true' || isFeatured === true
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, isFeatured } = req.body;
    let image = req.body.image;
    
    if (req.file) {
      image = req.file.path; // Cloudinary secure URL
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = name || category.name;
    category.image = image !== undefined ? image : category.image;
    if (isFeatured !== undefined) {
      category.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Optional: Check if products exist in this category before deleting
    // Or just delete
    await Category.findByIdAndDelete(id);
    res.json({ message: 'Category removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

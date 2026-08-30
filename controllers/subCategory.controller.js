import SubCategory from '../models/SubCategory.js';
import Category from '../models/Category.js';

export const createSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = req.file.path; // Cloudinary secure URL
    }
    
    if (!name || !category) {
      return res.status(400).json({ message: 'SubCategory name and parent category are required' });
    }

    const parentExists = await Category.findById(category);
    if (!parentExists) {
      return res.status(404).json({ message: 'Parent Category not found' });
    }

    const subCategoryExists = await SubCategory.findOne({ name, category });
    if (subCategoryExists) {
      return res.status(400).json({ message: 'SubCategory already exists under this parent' });
    }

    const newSubCategory = new SubCategory({
      name,
      category,
      image
    });

    await newSubCategory.save();
    res.status(201).json(newSubCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSubCategories = async (req, res) => {
  try {
    // Optionally filter by parent category if provided in query
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    const subCategories = await SubCategory.find(filter).populate('category', 'name');
    res.json(subCategories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateSubCategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = req.file.path;
    }

    const subCategory = await SubCategory.findById(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }

    subCategory.name = name || subCategory.name;
    subCategory.category = category || subCategory.category;
    subCategory.image = image !== undefined ? image : subCategory.image;

    await subCategory.save();
    res.json(subCategory);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findById(id);

    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }

    await SubCategory.findByIdAndDelete(id);
    res.json({ message: 'SubCategory removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

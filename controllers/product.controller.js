import Product from '../models/Product.js';

export const createProduct = async (req, res) => {
  try {
    const {
      sku, name, description, category, subCategory, material, purity,
      gender, weight, size, price,
      discountPrice, stock,
      isTrending, isNewArrival, isBestseller,
      hasCashOnDelivery, hasVerifiedQuality, has247Support, has1YearWarranty
    } = req.body;

    let images = req.body.images;
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => file.path); // Cloudinary secure URLs
    } else if (req.body.imageURL) {
      images = [req.body.imageURL];
    }

    if (!sku || !name || !description || !material || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const productExists = await Product.findOne({ sku });
    if (productExists) {
      return res.status(400).json({ message: 'Product with this SKU already exists' });
    }

    const newProduct = new Product({
      sku, name, description, category: category || null, subCategory: subCategory || null, material, purity,
      gender, weight, size, price,
      discountPrice, stock, images: images || [],
      isTrending: isTrending === 'true' || isTrending === true,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true,
      isBestseller: isBestseller === 'true' || isBestseller === true,
      hasCashOnDelivery: hasCashOnDelivery === undefined ? true : (hasCashOnDelivery === 'true' || hasCashOnDelivery === true),
      hasVerifiedQuality: hasVerifiedQuality === undefined ? true : (hasVerifiedQuality === 'true' || hasVerifiedQuality === true),
      has247Support: has247Support === undefined ? true : (has247Support === 'true' || has247Support === true),
      has1YearWarranty: has1YearWarranty === undefined ? true : (has1YearWarranty === 'true' || has1YearWarranty === true)
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .populate('subCategory', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate('category', 'name')
      .populate('subCategory', 'name');
      
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Update fields
    const fields = [
      'sku', 'name', 'description', 'category', 'subCategory', 'material', 'purity',
      'gender', 'weight', 'size', 'price',
      'discountPrice', 'stock',
      'isTrending', 'isNewArrival', 'isBestseller',
      'hasCashOnDelivery', 'hasVerifiedQuality', 'has247Support', 'has1YearWarranty'
    ];

    let images = [];
    if (req.body.existingImages) {
      if (req.body.existingImages === 'NONE') {
        images = [];
      } else {
        images = Array.isArray(req.body.existingImages) ? req.body.existingImages : [req.body.existingImages];
      }
    } else if (req.body.images && !req.files) {
      images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
    }

    if (req.files && req.files.length > 0) {
      const uploadedImages = req.files.map(file => file.path);
      images = [...images, ...uploadedImages];
    } else if (req.body.imageURL) {
      images.push(req.body.imageURL);
    }

    if (images.length > 0 || req.body.existingImages !== undefined) {
      product.images = images;
    }


    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        let val = req.body[field];
        if (field === 'isTrending' || field === 'isNewArrival' || field === 'isBestseller' || field.startsWith('has')) {
          val = val === 'true' || val === true;
        } else if ((field === 'price' || field === 'discountPrice' || field === 'stock') && val === '') {
          val = null;
        }
        product[field] = val;
      }
    });

    await product.save();
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

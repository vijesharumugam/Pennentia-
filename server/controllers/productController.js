const Product = require('../models/Product');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get product by ID
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, category, description, stock } = req.body;
    let image = req.body.image;
    if (req.file) {
      image = `/uploads/${req.file.filename}`;
    }
    if (!name || !image || !price || !category || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const product = new Product({ name, image, price, category, description, stock });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { name, image, price, category, description, stock } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, image, price, category, description, stock },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}; 
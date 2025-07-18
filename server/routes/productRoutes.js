const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Get all products
router.get('/', productController.getAllProducts);
// Get product by ID
router.get('/:id', productController.getProductById);
// Create a new product (with image upload)
router.post('/', upload.single('image'), productController.createProduct);
// Update a product
router.put('/:id', productController.updateProduct);
// Delete a product
router.delete('/:id', productController.deleteProduct);

module.exports = router; 
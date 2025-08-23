
const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  getProductsByCompany,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
// Product image upload endpoint
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Cloudinary URL is in req.file.path
  res.json({ imageUrl: req.file.path });
});

router.get('/', getAllProducts);
router.get('/company/:companyId', getProductsByCompany);
router.get('/:id', getProductById);
router.post('/', protect, authorizeRoles('owner'), addProduct);

router.put('/:id', protect, authorizeRoles('owner'), updateProduct);
router.delete('/:id', protect, authorizeRoles('owner'), deleteProduct);

module.exports = router;

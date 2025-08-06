const express = require('express');
const router = express.Router();
const {
  getCompanies,
  addCompany,
  updateCompany,
  deleteCompany
} = require('../controllers/companyController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.get('/', getCompanies);
router.post('/upload', protect, authorizeRoles('owner'), upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

router.put('/:id', protect, authorizeRoles('owner'), updateCompany);
router.delete('/:id', protect, authorizeRoles('owner'), deleteCompany);
router.post('/', protect, authorizeRoles('owner'), addCompany);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/', protect, authorizeRoles('owner'), getAllUsers);

module.exports = router;
const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { getAllUsers, getProfile, uploadAvatar, removeAvatar } = require('../controllers/userController');
router.put('/remove-avatar', protect, removeAvatar);
// Removed duplicate import
const upload = require('../middleware/upload');

router.get('/', protect, authorizeRoles('owner'), getAllUsers);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, async (req, res) => {
	try {
		const user = await require('../models/User').findByIdAndUpdate(
			req.user._id,
			{ name: req.body.name, email: req.body.email, phone: req.body.phone },
			{ new: true }
		).select('-password');
		if (!user) return res.status(404).json({ message: 'User not found' });
		res.json(user);
	} catch (err) {
		res.status(500).json({ message: 'Server error' });
	}
});
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);

module.exports = router;
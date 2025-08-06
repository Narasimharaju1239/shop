const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  getPendingOrdersCount
} = require('../controllers/orderController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);
router.get('/', protect, authorizeRoles('owner'), getAllOrders);
router.get('/pending-count', protect, authorizeRoles('owner'), getPendingOrdersCount);
router.patch('/:id', protect, authorizeRoles('owner'), updateOrderStatus);

module.exports = router;

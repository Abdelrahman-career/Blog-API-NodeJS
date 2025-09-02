const express = require('express');
const { getAllUsers, getUserById, deleteUser } = require('../controllers/userController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

const router = express.Router();

// كل المسارات التالية تتطلب تسجيل الدخول
router.use(protect);

// مسار جلب كل المستخدمين وحذف مستخدم محصور فقط بالـ "admin"
router.get('/', restrictTo('admin'), getAllUsers);
router.delete('/:id', restrictTo('admin'), deleteUser);

// أي مستخدم مسجل دخوله يمكنه جلب بيانات مستخدم آخر
router.get('/:id', getUserById);

module.exports = router;
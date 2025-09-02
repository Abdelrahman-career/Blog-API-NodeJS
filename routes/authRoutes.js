// الكود الثاني
const express = require('express');
const { signup, login } = require('../controllers/authController');
const userValidationSchema = require('../utils/validation/user');
const validate = require('../middlewares/validate');
// ✅ الإضافة الأولى: استيراد middleware جديد
const { preventIfLoggedIn } = require('../middlewares/guestMiddleware'); 

const router = express.Router();

// ✅ الإضافة الثانية: تطبيق الـ middleware الجديد على مسار التسجيل
router.post('/signup', preventIfLoggedIn, validate(userValidationSchema), signup);
router.post('/login', login);

module.exports = router;

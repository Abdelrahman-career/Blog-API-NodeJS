const User = require('../models/user');
const AppError = require('../utils/AppError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// دالة مساعدة لإنشاء وإمضاء التوكن (تبقى كما هي)
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/signup
 * @access  Public
 */
exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // --- ✅ التعديل الاحترافي: التحقق من الاسم والإيميل معًا ---
        // نستخدم $or للبحث عن مستخدم يطابق إما الإيميل أو الاسم
        const existingUser = await User.findOne({
            $or: [
                { email: email },
                { name: name }
            ]
        });

        if (existingUser) {
            // إذا وجدنا مستخدمًا، نحدد سبب التكرار لإعطاء رسالة واضحة
            if (existingUser.email === email) {
                return next(new AppError('هذا البريد الإلكتروني مسجل بالفعل.', 400));
            }
            if (existingUser.name === name) {
                return next(new AppError('اسم المستخدم هذا مأخوذ بالفعل، الرجاء اختيار اسم آخر.', 400));
            }
        }
        // --- نهاية التعديل ---

        // تشفير كلمة المرور
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // إنشاء مستخدم جديد
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // إنشاء توكن للمستخدم الجديد
        const token = signToken(newUser._id);

        // إخفاء كلمة المرور من الرد
        newUser.password = undefined;

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login an existing user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = async (req, res, next) => {
    // ... (هذه الوظيفة تبقى كما هي بدون أي تغيير)
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401));
        }

        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token
        });
    } catch (error) {
        next(error);
    }
};
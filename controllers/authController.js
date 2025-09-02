const User = require('../models/user');
const AppError = require('../utils/AppError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// دالة مساعدة لإنشاء وإمضاء التوكن
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

        // --- ✅ أفضل ممارسة: التحقق اليدوي لضمان عدم تكرار الإيميل ---
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new AppError('This email is already registered.', 400));
        }
        // --- نهاية التحقق اليدوي ---

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

        // إخفاء كلمة المرور من الرد (للأمان)
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
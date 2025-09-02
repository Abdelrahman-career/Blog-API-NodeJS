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

// @desc    Register a new user
// @route   POST /api/v1/auth/signup
exports.signup = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        
        // 1) تشفير كلمة المرور بقوة 12 (cost factor)
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // 2) إنشاء مستخدم جديد بالكلمة المشفرة
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // 3) إنشاء توكن للمستخدم الجديد
        const token = signToken(newUser._id);

        // 4) حذف كلمة المرور من الـ output قبل إرسال الرد (للأمان)
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

// @desc    Login a user
// @route   POST /api/v1/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1) التأكد من إدخال الإيميل وكلمة المرور
        if (!email || !password) {
            return next(new AppError('Please provide email and password', 400));
        }

        // 2) البحث عن المستخدم وجلب كلمة المرور معه للتحقق
        const user = await User.findOne({ email }).select('+password');

        // 3) التحقق من وجود المستخدم وصحة كلمة المرور
        // نستخدم bcrypt.compare لمقارنة الكلمة المدخلة مع الكلمة المشفرة في قاعدة البيانات
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return next(new AppError('Incorrect email or password', 401)); // 401 Unauthorized
        }

        // 4) إذا كان كل شيء صحيحًا، قم بإنشاء وإرسال التوكن
        const token = signToken(user._id);

        res.status(200).json({
            status: 'success',
            token
        });
    } catch (error) {
        next(error);
    }
};